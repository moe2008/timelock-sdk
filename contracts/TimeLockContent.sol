// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.24;

contract TimeLockContent {
    struct Listing {
        address seller;
        uint96  price;          // wei (0 => public)
        uint64  releaseTime;     // unix seconds
        uint64  revealDeadline;  // unix seconds (releaseTime + grace)
        string  cipherUri;       // IPFS/Arweave URL/CID
        bytes32 cipherHash;      // keccak256(ciphertext bytes) OR hash(metadata)
        bytes32 keyCommitment;   // keccak256(key || salt)
        uint96  deposit;         // seller deposit (optional)
        bool    keyRevealed;
        bytes   revealedKey;     // public after reveal
    }

    uint256 public listingCount;
    mapping(uint256 => Listing) public listings;

    // purchases for paid listings
    mapping(uint256 => mapping(address => bool)) public purchased;

    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        uint256 price,
        uint256 releaseTime,
        uint256 revealDeadline,
        string cipherUri,
        bytes32 cipherHash,
        bytes32 keyCommitment,
        uint256 deposit
    );

    event Purchased(uint256 indexed listingId, address indexed buyer, uint256 value);
    event KeyRevealed(uint256 indexed listingId);
    event Refunded(uint256 indexed listingId, address indexed buyer, uint256 value);

    error NotFound();
    error NotSeller();
    error RevealTooEarly();
    error AlreadyRevealed();
    error BadReveal();
    error WrongValue();
    error AlreadyPurchased();
    error NotPaidListing();
    error RefundNotAvailable();
    error AlreadyRefunded();

    mapping(uint256 => mapping(address => bool)) public refunded;

    /// @param price wei, 0 => public release
    /// @param releaseTime unix seconds
    /// @param cipherUri IPFS/Arweave link/CID
    /// @param cipherHash keccak256(ciphertext) (oder hash von metadata)
    /// @param keyCommitment keccak256(key||salt)
    /// @param revealGraceSeconds revealDeadline = releaseTime + grace
    function createListing(
        uint96 price,
        uint64 releaseTime,
        string calldata cipherUri,
        bytes32 cipherHash,
        bytes32 keyCommitment,
        uint64 revealGraceSeconds
    ) external payable returns(uint256 listingId) {
        require(releaseTime > block.timestamp, "release in past");

        listingId = ++listingCount;

        Listing storage L = listings[listingId];
        L.seller = msg.sender;
        L.price = price;
        L.releaseTime = releaseTime;
        L.revealDeadline = releaseTime + revealGraceSeconds;
        L.cipherUri = cipherUri;
        L.cipherHash = cipherHash;
        L.keyCommitment = keyCommitment;
        L.deposit = uint96(msg.value);

        emit ListingCreated(
            listingId,
            msg.sender,
            price,
            releaseTime,
            L.revealDeadline,
            cipherUri,
            cipherHash,
            keyCommitment,
            msg.value
        );
    }

    /// Paid listings only (price > 0). Pays seller immediately (MVP).
    function buy(uint256 listingId) external payable {
        Listing storage L = listings[listingId];
        if (L.seller == address(0)) revert NotFound();
        if (L.price == 0) revert NotPaidListing();
        if (purchased[listingId][msg.sender]) revert AlreadyPurchased();
        if (msg.value != L.price) revert WrongValue();

        purchased[listingId][msg.sender] = true;

        (bool ok, ) = L.seller.call{ value: msg.value } ("");
        require(ok, "payout failed");

        emit Purchased(listingId, msg.sender, msg.value);
    }

    /// Seller reveals key after releaseTime. Verifies commit.
    function revealKey(uint256 listingId, bytes calldata key, bytes32 salt) external {
        Listing storage L = listings[listingId];
        if (L.seller == address(0)) revert NotFound();
        if (msg.sender != L.seller) revert NotSeller();
        if (block.timestamp < L.releaseTime) revert RevealTooEarly();
        if (L.keyRevealed) revert AlreadyRevealed();

        bytes32 c = keccak256(abi.encodePacked(key, salt));
        if (c != L.keyCommitment) revert BadReveal();

        L.keyRevealed = true;
        L.revealedKey = key;

        emit KeyRevealed(listingId);

        // return deposit if any
        if (L.deposit > 0) {
            uint256 dep = L.deposit;
            L.deposit = 0;
            (bool ok, ) = L.seller.call{ value: dep } ("");
            require(ok, "deposit return failed");
        }
    }

    /// Refund for paid listings if deadline passed and key not revealed.
    /// Refund comes from contract balance (deposit should fund it).
    function claimRefund(uint256 listingId) external {
        Listing storage L = listings[listingId];
        if (L.seller == address(0)) revert NotFound();
        if (L.price == 0) revert RefundNotAvailable();
        if (!purchased[listingId][msg.sender]) revert RefundNotAvailable();
        if (L.keyRevealed) revert RefundNotAvailable();
        if (block.timestamp <= L.revealDeadline) revert RefundNotAvailable();
        if (refunded[listingId][msg.sender]) revert AlreadyRefunded();

        refunded[listingId][msg.sender] = true;

        uint256 amount = L.price;
        if (address(this).balance < amount) revert RefundNotAvailable();

        (bool ok, ) = msg.sender.call{ value: amount } ("");
        require(ok, "refund failed");

        emit Refunded(listingId, msg.sender, amount);
    }

    function getListing(uint256 listingId)
    external
    view
    returns(
        address seller,
        uint256 price,
        uint256 releaseTime,
        uint256 revealDeadline,
        string memory cipherUri,
        bytes32 cipherHash,
        bytes32 keyCommitment,
        bool keyRevealed,
        bytes memory revealedKey,
        uint256 deposit
    )
    {
        Listing storage L = listings[listingId];
        if (L.seller == address(0)) revert NotFound();

        return (
            L.seller,
            L.price,
            L.releaseTime,
            L.revealDeadline,
            L.cipherUri,
            L.cipherHash,
            L.keyCommitment,
            L.keyRevealed,
            L.revealedKey,
            L.deposit
        );
    }

    receive() external payable { }
}
