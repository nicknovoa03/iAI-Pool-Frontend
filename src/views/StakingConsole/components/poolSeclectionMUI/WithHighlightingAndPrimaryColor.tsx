import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

const mock = [
  {
    title: 'Pool 1',
    features: [
      'THRESHOLD: 10,000 iAI Tokens',
      'Minimum 9022 NFTs Required: 1',
      'YEARLY Distribution on iAI THRESHOLD: 2%'
    ],
    iAiTokenReqs: 10000,
    nftBackgroundReqs: ['Standard', 'DI', 'Prestige'],
    nftCountReqs: 1,
    size: 4,
    href: '/Pool1'
  },
  {
    title: 'Pool 2',
    features: [
      'THRESHOLD: 30,000 iAI Tokens',
      'Minimum 9022 NFTs Required: 2',
      'YEARLY Distribution on iAI THRESHOLD: 4%'
    ],
    iAiTokenReqs: 30000,
    nftBackgroundReqs: ['Standard', 'DI', 'Prestige'],
    nftCountReqs: 1,
    size: 4,
    href: '/Pool1'
  },
  {
    title: 'Pool 3',
    features: [
      'THRESHOLD: 100,000 iAI Tokens',
      'Minimum 9022 NFTs Required: 3-10',
      'YEARLY Distribution on iAI THRESHOLD: 5.5%',
      '.5% will be added to the total distribution for each NFT held >3. Max 9% iAI THRESHOLD'
    ],
    iAiTokenReqs: 100000,
    nftBackgroundReqs: ['Standard', 'DI', 'Prestige'],
    nftCountReqs: 3,
    size: 4,
    href: '/Pool1'
  },
  {
    title: 'Prestige Ambassador',
    features: [
      'THRESHOLD: 200,000 iAI Tokens',
      '9022 NFTs Required: Prestige',
      'YEARLY Distribution on iAI THRESHOLD: 10%'
    ],
    iAiTokenReqs: 200000,
    nftBackgroundReqs: ['DI', 'Prestige'],
    nftCountReqs: 1,
    size: 6,
    href: '/Pool1'
  },
  {
    title: 'Destination Inheritance Ambassador',
    features: [
      'THRESHOLD: 300,000 iAI Tokens',
      '9022 NFTs Required: Destination Inheritance',
      'YEARLY Distribution on iAI THRESHOLD: 12%'
    ],
    iAiTokenReqs: 300000,
    nftBackgroundReqs: ['DI'],
    nftCountReqs: 1,
    size: 6,
    href: '/Pool1'
  }
];

const WithHighlightingAndPrimaryColor = (ownedNfts: any) => {
  const theme = useTheme();
  let [nftCount, setNftCount] = useState(0);
  let [prestigeFlag, setPrestigeFlag] = useState<Boolean>(false);
  let [destinationInheritanceFlag, setDestinationInheritanceFlag] = useState<Boolean>(false);

  useEffect(() => {
    let sum = 0;
    let nfts: any = Object.values(ownedNfts)[0];
    //setNftCount(Object.values(ownedNfts)[0]);
    console.log('owned nfts:', nfts);
    //console.log('nft count:', Object.keys(nfts));
    for (const key in nfts) {
      if (key == 'Prestige') {
        setPrestigeFlag(true);
      }
      if (key == 'DI') {
        setDestinationInheritanceFlag(true);
      }
      sum += nfts[key];
    }
    setNftCount(sum);
    console.log('nftCount:', nftCount);
    console.log('prestige flag:', prestigeFlag);
    console.log('DI flag:', destinationInheritanceFlag);
  });

  return (
    <Grid container spacing={4}>
      {mock.map((item, i) => (
        <Grid item md={item.size} key={i}>
          <Box
            component={Card}
            height={1}
            display={'flex'}
            flexDirection={'column'}
            bgcolor={theme.palette.common.black}
            sx={{ borderRadius: 3, border: '1px solid white' }}
            data-aos={'flip-left'}
          >
            <CardContent
              sx={{
                padding: 4
              }}
            >
              <Box marginBottom={0}>
                <Typography variant={'h4'} align="center" color={theme.palette.common.white}>
                  <Box component={'span'} fontWeight={600}>
                    {item.title}
                  </Box>
                </Typography>
              </Box>

              <Box marginBottom={2}>
                <Typography variant={'h5'} align="center" color={theme.palette.common.white}>
                  {nftCount >= item.nftCountReqs ? (
                    <Box
                      component="span"
                      sx={{
                        padding: 0.5,
                        color: 'green'
                      }}
                      fontWeight={600}
                    >
                      Elidgable
                    </Box>
                  ) : (
                    <Box
                      component="span"
                      sx={{
                        padding: 0.5,
                        color: 'red'
                      }}
                      fontWeight={600}
                    >
                      Inelidgable
                    </Box>
                  )}
                </Typography>
              </Box>
              <Grid container spacing={1}>
                {item.features.map((feature, j) => (
                  <Grid item xs={12} key={j}>
                    <Box component={ListItem} padding={0}>
                      <Box component={ListItemAvatar} minWidth={'auto !important'} marginRight={2}>
                        <Box component={Avatar} bgcolor={theme.palette.primary.main} width={20} height={20}>
                          <svg
                            width={12}
                            height={12}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </Box>
                      </Box>
                      <ListItemText primary={feature} style={{ color: theme.palette.common.white }} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
            <Box flexGrow={1} />

            <CardActions sx={{ justifyContent: 'flex-end', padding: 4 }}>
              <Button size={'large'} variant={'contained'} href={item.href}>
                Learn More
              </Button>
            </CardActions>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default WithHighlightingAndPrimaryColor;