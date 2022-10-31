import { useEffect, useRef, useState } from 'react';
import { DatabaseService, DeckInfo } from '../../services/dbSvc';
import { DeckImport } from './deckImport';
import { CardContent, Divider, Paper } from '@mui/material';
import { DeckSelect } from './deckSelect';
import { Pane } from '../gameLayout/gameLayout';

interface LefterProps {
    onDeckSelect(deckInfo?: DeckInfo): void;
}

export const Lefter = ({ onDeckSelect }: LefterProps) => {
    const deckImportRef = useRef<HTMLInputElement>(null);

    const [decks, setDecks] = useState<DeckInfo[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const updateDecksAndSelection = (index: number, updatedDecks?: DeckInfo[]) => {
        updatedDecks = updatedDecks ?? decks;
        const selectedDeck = updatedDecks.length === 0 ? undefined : updatedDecks[index];
        DatabaseService.putSelectedDeckName(selectedDeck?.name ?? '');
        setDecks(updatedDecks);
        setSelectedIndex(index);
        onDeckSelect(selectedDeck);
    };

    const addDeck = (deckInfo: DeckInfo) => {
        updateDecksAndSelection(decks.length, decks.concat(deckInfo));
    };

    useEffect(() => {
        const fetchDecks = async () => {
            const decks = await DatabaseService.getDecks();
            const nameToSelect = DatabaseService.getSelectedDeckName();
            const indexToSelect = Math.max(
                0,
                decks.findIndex((di) => di.name === nameToSelect)
            );
            updateDecksAndSelection(indexToSelect, decks);
        };
        fetchDecks();

        // Run useEffect only once.
        // eslint-disable-next-line
    }, []);

    return (
        <Pane id='lefter'>
            <CardContent>
                <h1 style={{ margin: 6, marginBottom: 16 }}>Let's Go Fishing</h1>

                <Paper>
                    <DeckImport ref={deckImportRef} onImport={addDeck} />
                    <Divider />
                    <DeckSelect
                        decks={decks}
                        selectedIndex={selectedIndex}
                        onUpdateDecksAndSelection={updateDecksAndSelection}
                        onClickPlaceholder={() => deckImportRef.current?.focus()}
                    />
                </Paper>
            </CardContent>
        </Pane>
    );
};
