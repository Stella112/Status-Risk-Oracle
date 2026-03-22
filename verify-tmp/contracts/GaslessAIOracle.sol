// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GaslessAIOracle {
    string public latestPrediction;
    address public lastUpdater;

    event PredictionUpdated(address indexed updater, string prediction);

    function updatePrediction(string calldata _prediction) external {
        latestPrediction = _prediction;
        lastUpdater = msg.sender;
        emit PredictionUpdated(msg.sender, _prediction);
    }
}
