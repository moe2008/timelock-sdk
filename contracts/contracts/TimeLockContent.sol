// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TimeLockContent {
    struct Listing {
        address seller;
        uint96 price;
        uint64 releaseTime;
        uint64 revealDeadline;
        string cipherUri;
        bytes32 cipherHash;
        bytes32 keyCommitment;
        uint96 deposit;
        bool keyRevealed;
        bytes revealedKey;
        // 🔥 Timelock
        bool isTimelockEnabled;
        uint64 drandRound;
        bytes timelockEncryptedKey;
    }

    uint256 public listingCount;
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => mapping(address => bool)) public purchased;
    mapping(uint256 => mapping(address => bool)) public refunded;

    // 🔥 FIX: Event vereinfacht - weniger Parameter
    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        uint256 releaseTime,
        bool isTimelockEnabled
    );

    event Purchased(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 value
    );

    event KeyRevealed(uint256 indexed listingId);

    event Refunded(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 value
    );

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

    function createListing(
        uint96 price,
        uint64 releaseTime,
        string calldata cipherUri,
        bytes32 cipherHash,
        bytes32 keyCommitment,
        uint64 revealGraceSeconds,
        bool isTimelockEnabled,
        uint64 drandRound,
        bytes calldata timelockEncryptedKey
    ) external payable returns (uint256 listingId) {
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
        L.isTimelockEnabled = isTimelockEnabled;

        if (isTimelockEnabled) {
            L.drandRound = drandRound;
            L.timelockEncryptedKey = timelockEncryptedKey;
        }

        // 🔥 FIX: Nur wichtigste Daten im Event
        emit ListingCreated(
            listingId,
            msg.sender,
            releaseTime,
            isTimelockEnabled
        );
    }

    function buy(uint256 listingId) external payable {
        Listing storage L = listings[listingId];
        if (L.seller == address(0)) revert NotFound();
        if (L.price == 0) revert NotPaidListing();
        if (purchased[listingId][msg.sender]) revert AlreadyPurchased();
        if (msg.value != L.price) revert WrongValue();

        purchased[listingId][msg.sender] = true;

        (bool ok, ) = L.seller.call{value: msg.value}("");
        require(ok, "payout failed");

        emit Purchased(listingId, msg.sender, msg.value);
    }

    function revealKey(
        uint256 listingId,
        bytes calldata key,
        bytes32 salt
    ) external {
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

        if (L.deposit > 0) {
            uint256 dep = L.deposit;
            L.deposit = 0;
            (bool ok, ) = L.seller.call{value: dep}("");
            require(ok, "deposit return failed");
        }
    }

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

        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "refund failed");

        emit Refunded(listingId, msg.sender, amount);
    }

    // Return komplettes Struct
    function getListing(
        uint256 listingId
    ) external view returns (Listing memory) {
        Listing storage L = listings[listingId];
        if (L.seller == address(0)) revert NotFound();
        return L;
    }

    receive() external payable {}
}
