import { useState } from 'react';
import { TH1, TH3, TP } from '../components/THeadings';
import TImage from '../components/TImage';
import { TContainedButton } from '../components/TContainedButton';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const styles = {
    container: {
        flex: 1,
        textAlign: 'center' as const,
        alignSelf: 'center',
    },
    loadingSpace: {
        marginTop: '100px',
        marginBottom: '30px',
    },
};

const Loading = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [connected, setConnected] = useState<boolean>(true);

    return (
        <div style={styles.container}>
            <TImage height={60} src={'src/sso/assets/tonomy/tonomy-logo1024.png'} alt="Tonomy Logo" />
            <TH1>{'Tonomy'}</TH1>
            {connected && <TH3>{'Jack'}</TH3>}
            <div style={styles.loadingSpace}>
                <TImage src={'src/sso/assets/tonomy/connecting.png'} alt="Connecting Phone-PC" />
                <TP>Linking to phone and sending data. Please remain connected. </TP>
            </div>
            {loading && (
                <div style={styles.loadingSpace}>
                    <TContainedButton style={{ marginTop: '20px' }}>Cancel</TContainedButton>
                </div>
            )}
            {connected && (
                <div style={styles.loadingSpace}>
                    <Button
                        onClick={() => {
                            setConnected(false);
                            setLoading(true);
                        }}
                        variant="outlined"
                        startIcon={<LogoutIcon></LogoutIcon>}
                    >
                        Logout
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Loading;
