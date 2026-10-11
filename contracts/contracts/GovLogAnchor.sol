// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GovLogAnchor
 * @notice Immutable on-chain anchor for government audit logs and cryptographic Merkle roots.
 * @dev Designed for high-integrity municipal and federal tamper-evident logging.
 */
contract GovLogAnchor {
    struct BatchRecord {
        uint256 batchId;
        bytes32 merkleRoot;
        uint256 logCount;
        uint256 timestamp;
        uint256 blockNumber;
        address operator;
        string metadataURI;
    }

    address public owner;
    uint256 public totalBatches;
    uint256 public totalLogsAnchored;

    // batchId => BatchRecord
    mapping(uint256 => BatchRecord) public batches;

    // merkleRoot => batchId (0 if nonexistent)
    mapping(bytes32 => uint256) public rootToBatchId;

    // Events
    event BatchAnchored(
        uint256 indexed batchId,
        bytes32 indexed merkleRoot,
        uint256 logCount,
        uint256 timestamp,
        address indexed operator,
        string metadataURI
    );

    event ProofVerified(
        uint256 indexed batchId,
        bytes32 indexed leafHash,
        bool isValid,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can execute");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Anchors a new Merkle root for a batch of ingested government logs.
     * @param _merkleRoot SHA-256 Merkle root of the batch.
     * @param _logCount Number of logs in this batch.
     * @param _metadataURI URI or metadata tag (e.g. department tag, IPFS CID).
     * @return batchId Unique identifier for the anchored batch.
     */
    function anchorBatch(
        bytes32 _merkleRoot,
        uint256 _logCount,
        string calldata _metadataURI
    ) external returns (uint256) {
        require(_merkleRoot != bytes32(0), "Merkle root cannot be zero");
        require(_logCount > 0, "Log count must be greater than zero");
        require(rootToBatchId[_merkleRoot] == 0, "Merkle root already anchored");

        totalBatches += 1;
        uint256 currentBatchId = totalBatches;
        totalLogsAnchored += _logCount;

        batches[currentBatchId] = BatchRecord({
            batchId: currentBatchId,
            merkleRoot: _merkleRoot,
            logCount: _logCount,
            timestamp: block.timestamp,
            blockNumber: block.number,
            operator: msg.sender,
            metadataURI: _metadataURI
        });

        rootToBatchId[_merkleRoot] = currentBatchId;

        emit BatchAnchored(
            currentBatchId,
            _merkleRoot,
            _logCount,
            block.timestamp,
            msg.sender,
            _metadataURI
        );

        return currentBatchId;
    }

    /**
     * @notice Verifies whether a leaf hash belongs to a specific anchored batch using SHA-256 Merkle proof.
     * @param _batchId ID of the batch to verify against.
     * @param _leafHash SHA-256 hash of the target log.
     * @param _proof Array of sibling hashes forming the Merkle audit path.
     * @return isValid True if proof successfully recalculates the batch Merkle root.
     */
    function verifyLog(
        uint256 _batchId,
        bytes32 _leafHash,
        bytes32[] calldata _proof
    ) external returns (bool isValid) {
        require(_batchId > 0 && _batchId <= totalBatches, "Batch ID does not exist");
        bytes32 root = batches[_batchId].merkleRoot;

        isValid = verifyProofSha256(root, _leafHash, _proof);

        emit ProofVerified(_batchId, _leafHash, isValid, block.timestamp);
        return isValid;
    }

    /**
     * @notice Pure verification function checking SHA-256 Merkle proof without state mutation.
     * @param _root The expected Merkle root.
     * @param _leaf The leaf node hash to verify.
     * @param _proof Array of sibling hashes in order from leaf to root.
     * @return True if computed root equals _root.
     */
    function verifyProofSha256(
        bytes32 _root,
        bytes32 _leaf,
        bytes32[] calldata _proof
    ) public pure returns (bool) {
        bytes32 computedHash = _leaf;

        for (uint256 i = 0; i < _proof.length; i++) {
            bytes32 proofElement = _proof[i];

            // Sorted pair hashing (lexicographical order) to maintain deterministic trees
            if (computedHash <= proofElement) {
                computedHash = sha256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = sha256(abi.encodePacked(proofElement, computedHash));
            }
        }

        return computedHash == _root;
    }

    /**
     * @notice Returns batch details by batchId.
     */
    function getBatch(uint256 _batchId) external view returns (BatchRecord memory) {
        require(_batchId > 0 && _batchId <= totalBatches, "Batch not found");
        return batches[_batchId];
    }

    /**
     * @notice Returns batch details by its Merkle Root.
     */
    function getBatchByRoot(bytes32 _merkleRoot) external view returns (BatchRecord memory) {
        uint256 batchId = rootToBatchId[_merkleRoot];
        require(batchId != 0, "Merkle root not found");
        return batches[batchId];
    }

    /**
     * @notice Retrieves recent batches for dashboard streaming.
     * @param _limit Maximum number of batches to retrieve.
     */
    function getRecentBatches(uint256 _limit) external view returns (BatchRecord[] memory) {
        if (totalBatches == 0) {
            return new BatchRecord[](0);
        }

        uint256 count = _limit > totalBatches ? totalBatches : _limit;
        BatchRecord[] memory result = new BatchRecord[](count);

        for (uint256 i = 0; i < count; i++) {
            result[i] = batches[totalBatches - i];
        }

        return result;
    }
}
