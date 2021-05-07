import React from 'react'
import { useStateValue } from './StateProvider';
import { useTheme } from '@material-ui/core/styles'
import {
    Avatar,
    Box,
    Divider,
    Typography,
    makeStyles

} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    avatar: {
        cursor: 'pointer',
        width: 64,
        height: 64
    }
}));


function ProfileCard() {
    const [state, dispatch] = useStateValue();
    const classes = useStyles();
    const theme = useTheme()
    return (
        <div>
            <Box
                alignItems="center"
                display="flex"
                flexDirection="column"
                style={{ backgroundImage: (theme.palette.type === 'dark')?'url(/back-dark.svg)':'url(/back.svg)' }}
                p={2}
            >
                <Avatar
                    className={classes.avatar}
                    
                    src={state.picture}

                />
                <Typography
                    
                    color="textPrimary"
                    variant="body1"
                >
                    {state.name}
                </Typography>
                <Typography
                    color="textSecondary"
                    variant="body2"
                >
                    {state.email}
                </Typography>
            </Box>
            <Divider />
            
        </div>
    )
}

export default ProfileCard
