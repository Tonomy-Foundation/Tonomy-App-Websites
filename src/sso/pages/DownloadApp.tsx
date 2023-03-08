import React from 'react';
import { TA } from '../components/Tbuttons';
import { TH1, TH2, TH3, TP } from '../components/THeadings';
import TImage from '../components/TImage';
import appStoreImage from '../assets/app-store.svg';
import './DownloadApp.css';
import settings from '../settings';
import playStoreBadge from '../assets/google-play-badge.png';
import appleStoreBadge from '../assets/tonomy/tonomy-logo1024.png';

export default function DownloadApp() {
    return (
        <div className="container">
            <TImage src={appleStoreBadge} height={86}></TImage>
            <TH1>Tonomy ID</TH1>
            <TH3>The easiest and safest way to access Tonomy apps</TH3>
            <TP>
                Tonomy ID is a self-sovereign identity digital wallet that protects your security and privacy. &nbsp;
                <TA href={settings.config.links.readMoreDownload}>Learn more</TA>
            </TP>

            <TP>
                It is open-source and maintained by the Tonomy Foundation. <TA>Learn more</TA>
            </TP>
            <div>
                <a href={settings.config.links.appleStoreDownload}>
                    <img alt="Get it on Apple store" width="200px" src={appStoreImage} />
                </a>
            </div>

            <div>
                <a href={settings.config.links.playStoreDownload}>
                    <img alt="Get it on Google Play" width="230px" src={playStoreBadge} />
                </a>
            </div>
            <TP>
                Already have Tonomy? <TA>Log in here</TA>
            </TP>
        </div>
    );
}
