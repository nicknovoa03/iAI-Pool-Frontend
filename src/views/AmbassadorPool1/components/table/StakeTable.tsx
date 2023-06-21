import { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Box, Typography } from '@mui/material'
import Container from '../../../../components/Container'
import { MainButton, StakeCell, StakeTableContainer, UnstakeButton, WithDrawButton } from '../form/formElements'
import { useContractWrite, useWaitForTransaction } from 'wagmi'
import {
  UnstakePreparedContract,
  WithdrawPreparedContract,
  AllStaked,
  ClaimRewardPreparedContract
} from '../contracts/wagmiContracts'
import { BigNumber, ethers } from 'ethers'
import { StakingBalance } from '../contracts/wagmiContracts'

type StakeTableProps = {
  address: `0x${string}` | undefined
}

interface StakeData {
  id: number
  startDate: string
  amount: string
  interest: string
  penalty: string
  endDate: string
  stakeComplete: boolean
}

export default function StakeTable({ address }: StakeTableProps) {
  let [stakingBalance, setStakingBalance] = useState<String>('0')
  let [hasStakes, setHasStakes] = useState(false)
  let [activeStakes, setActiveStakes] = useState<StakeData[]>([])
  let [selectedIndex, setSelectedIndex] = useState<number>()
  let [hasRewards, setHasRewards] = useState<Boolean>(false)

  function createData(
    id: number,
    startDate: string,
    amount: string,
    interest: number,
    penalty: number,
    endDate: string,
    stakeComplete: boolean
  ) {
    return { id, startDate, amount, interest, penalty, endDate, stakeComplete }
  }
  const penalty = 0
  const interest = 7.5

  // Staking balance
  const stakingBalanceData = StakingBalance({ ownerAddress: address! }) as BigNumber

  // Unstake
  const unstakeConfig = UnstakePreparedContract({
    index: selectedIndex!
  })

  const { data: unstakeData, write: unstakeWrite } = useContractWrite(unstakeConfig)

  const { isLoading: unstakeIsLoading, isSuccess: unStakeIsSuccessful } = useWaitForTransaction({
    hash: unstakeData?.hash
  })

  // Withdraw
  const withdrawConfig = WithdrawPreparedContract({
    index: selectedIndex!
  })
  const { data: withdrawData, write: withdrawWrite } = useContractWrite(withdrawConfig)
  const { isLoading: withdrawIsLoading, isSuccess: withdrawIsSuccessful } = useWaitForTransaction({
    hash: withdrawData?.hash
  })

  // Claim Rewards
  const claimRewardConfig = ClaimRewardPreparedContract()
  const { data: claimRewardsData, write: claimRewardsWrite } = useContractWrite(claimRewardConfig)
  const { isLoading: claimRewardsIsLoading, isSuccess: claimRewardsIsSuccess } = useWaitForTransaction({
    hash: claimRewardsData?.hash
  })

  const staked = AllStaked({ ownerAddress: address })

  useEffect(() => {
    if (stakingBalanceData) {
      setStakingBalance(ethers.utils.formatEther(stakingBalanceData))
    }
  }, [stakingBalanceData])

  // This is a React useEffect hook that will run whenever the value of `staked` changes
  useEffect(() => {
    // Check if `staked` is an array and has at least one element
    if (Array.isArray(staked) && staked.length > 0) {
      let activeStake: any = []
      setHasStakes(true)
      // Iterate through each element in `staked`
      let currentDate = new Date()
      for (let i = 0; i < staked.length; i++) {
        // Convert the `amount` value from Wei to Ether
        let amount = ethers.utils.formatEther(staked[i].amount)
        // Convert the timestamp value to a JavaScript Date object for the start and end dates
        let startDate = new Date(staked[i].timestamp.toNumber() * 1000)
        let endDate = new Date(staked[i].timestamp.toNumber() * 1000)
        // Add 30 days to the end date
        endDate.setDate(endDate.getDate())
        // check if end date is passed the current datez
        let stakeComplete = false
        if (endDate < currentDate) {
          stakeComplete = true
          setHasRewards(true)
        }
        // Create an object with the formatted start date, amount, interest rate, penalty rate, and formatted end date
        let stakeData = createData(
          i,
          startDate.toLocaleString(),
          amount,
          interest,
          penalty,
          endDate.toLocaleString(),
          stakeComplete
        )
        // Add the stake data object to the `activeStake` array
        activeStake.push(stakeData)
      }
      setActiveStakes(activeStake)
    }
  }, [staked])

  function handleWithdrawClick(id: number) {
    setIndexFromClick(id)
    if (withdrawWrite) {
      //console.log(selectedIndex)
      withdrawWrite()
    }
  }

  function handleUnstakeClick(id: number) {
    setIndexFromClick(id)
    if (unstakeWrite) {
      //console.log(selectedIndex)
      unstakeWrite()
    }
  }

  function setIndexFromClick(id: number) {
    setSelectedIndex(id)
  }

  return (
    <>
      {hasStakes && (
        <Container>
          <Box display="flex" flexDirection={'column'} alignItems={'center'} data-aos={'fade-in'}>
            <Box marginBottom={3}>
              <Typography
                variant="h4"
                align="center"
                sx={{ mt: 1 }}
                color="white"
                fontWeight={'bold'}
                data-aos={'zoom-in'}
                textTransform="uppercase"
              >
                Active Stakes
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,.7);',
                px: 2,
                py: 3,
                borderRadius: 3,
                border: '1px solid white'
              }}
              maxWidth={{ xs: 375, sm: 550, md: 750, lg: 1000 }}
              data-aos={'zoom-in-up'}
            >
              <StakeTableContainer>
                <Typography
                  fontSize={18}
                  align="center"
                  sx={{ mb: 3 }}
                  color="white"
                  fontWeight={'bold'}
                  data-aos={'zoom-in'}
                  textTransform="uppercase"
                >
                  Personal Staked: {stakingBalance} $Truth
                </Typography>
                {hasRewards && (
                  <Box display="flex" justifyContent="center" alignItems="center" margin={2}>
                    <MainButton
                      disabled={!claimRewardsWrite || claimRewardsIsLoading}
                      onClick={() => claimRewardsWrite?.()}
                      variant="contained"
                    >
                      Claim Rewards
                    </MainButton>
                  </Box>
                )}
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <StakeCell align="center">ID</StakeCell>
                      <StakeCell align="center">START DATE</StakeCell>
                      <StakeCell align="center">AMOUNT</StakeCell>
                      <StakeCell align="center">INTEREST</StakeCell>
                      <StakeCell align="center">PENALTY</StakeCell>
                      <StakeCell align="center">END DATE</StakeCell>
                      <StakeCell align="center"></StakeCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeStakes
                      .slice()
                      .reverse()
                      .map((row) => (
                        <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <StakeCell align="center">{row.id + 1}</StakeCell>
                          <StakeCell align="center">{row.startDate}</StakeCell>
                          <StakeCell align="center">{row.amount}</StakeCell>
                          <StakeCell align="center">{row.interest + '%'}</StakeCell>
                          <StakeCell align="center">{row.penalty + '%'}</StakeCell>
                          <StakeCell align="center">{row.endDate}</StakeCell>
                          <StakeCell align="center">
                            {!row.stakeComplete && (
                              <WithDrawButton disabled={withdrawIsLoading} onClick={() => handleWithdrawClick(row.id)}>
                                {withdrawIsLoading ? 'Loading...' : 'Withdraw'}
                              </WithDrawButton>
                            )}
                            {row.stakeComplete && (
                              <WithDrawButton disabled={unstakeIsLoading} onClick={() => handleUnstakeClick(row.id)}>
                                {withdrawIsLoading ? 'Loading...' : 'Unstake'}
                              </WithDrawButton>
                            )}
                          </StakeCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </StakeTableContainer>
            </Box>
          </Box>
        </Container>
      )}
    </>
  )
}