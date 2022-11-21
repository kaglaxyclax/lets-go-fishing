import cardBack from '../../assets/mtg-card-back.png';
import '../css/card.css';

import { useEffect, useState } from 'react';
import { CardInfoService } from '../../services/cardInfoSvc';
import { cancelablePromise } from '../../utilities/helpers';
import { ZoneCardInfo } from './zone';
import { CARD_HEIGHT_PX, CARD_WIDTH_PX } from '../../utilities/constants';

export interface VisualCardProps {
    zoneCard: ZoneCardInfo;
    faceDown?: boolean;
    wiggle?: boolean;
}

export const VisualCard = ({ zoneCard, faceDown, wiggle }: VisualCardProps) => {
    const [imageUrl, setImageUrl] = useState('');

    const { card, previewing, tapped } = zoneCard;
    const isLoading = !imageUrl && !faceDown;
    const faceUpAndLoaded = !isLoading && !faceDown;

    useEffect(() => {
        setImageUrl('');
        const { promise, cancel } = cancelablePromise(CardInfoService.getCardImageUrl(card));
        promise.then((url) => setImageUrl(url)).catch(() => {});
        return cancel;
    }, [card]);

    const imageStyle = {
        backgroundImage: `url(${isLoading || faceDown ? cardBack : imageUrl})`,
    };
    const className =
        'card' +
        (isLoading ? ' loading' : '') +
        (faceUpAndLoaded && previewing ? ' previewing' : '') +
        (faceUpAndLoaded && card.foil ? ' foil' : '') +
        (tapped ? ' tapped' : '') +
        (wiggle ? ' wiggle' : '');

    return (
        <div style={{ width: CARD_WIDTH_PX, height: CARD_HEIGHT_PX }}>
            <div style={{ width: CARD_WIDTH_PX, height: CARD_HEIGHT_PX, position: 'absolute' }}>
                <div className={className} style={imageStyle}>
                    {/* Separate divs needed to prevent React from replacing one with the other 
                        during CSS animations. */}
                    <div className='loader' style={isLoading ? {} : { display: 'none' }} />
                    <div className='card-face' style={isLoading ? { display: 'none' } : {}} />
                </div>
            </div>
        </div>
    );
};
