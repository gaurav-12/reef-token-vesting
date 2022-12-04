// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Vesting.sol";
import "./Token.sol";

/**
 * @title TokenVesting
 * @dev A token holder contract that can release its token balance gradually like a
 * typical vesting scheme, with a cliff and vesting period. Optionally revocable by the
 * owner.
 */
contract Factory is Ownable {
    struct VestingDetails {
        address _vesting;
        address _token;
        address _beneficiary;
        bool _revokable;
    }

    mapping(address => VestingDetails[]) _vestingDetails;

    function createVesting(
        address vestingOwner_,
        address beneficiary_,
        address token_,
        uint256 start_,
        uint256 cliffDuration_,
        uint256 duration_,
        uint256 supply_,
        bool revokable_,
        bool createToken_,
        string memory name_,
        string memory symbol_
    ) external returns (address) {
        if (createToken_) {
            token_ = address(new Token(name_, symbol_, supply_));
        }
        address vesting = address(
            new TokenVesting(
                beneficiary_,
                start_,
                cliffDuration_,
                duration_,
                revokable_
            )
        );
        _vestingDetails[vestingOwner_].push(
            VestingDetails(vesting, token_, beneficiary_, revokable_)
        );
        return vesting;
    }

    function getAllVestings(address vestingOwner_)
        external
        view
        returns (VestingDetails[] memory)
    {
        return _vestingDetails[vestingOwner_];
    }
}
