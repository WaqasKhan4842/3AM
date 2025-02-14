import { useState } from 'react';
import { Card, TextInput, Button, Title, Select, Grid, List, Group } from '@mantine/core';
import { IconPlus, IconUser, IconCalendar } from '@tabler/icons-react';

export function OrganizerDashboard() {
    const [rounds, setRounds] = useState([]);
    const [contestants, setContestants] = useState([
        { id: 1, name: 'Contestant 1' },
        { id: 2, name: 'Contestant 2' },
        // Add more contestants as needed
    ]);
    const [slots, setSlots] = useState({});

    const addRound = (roundName) => {
        setRounds([...rounds, roundName]);
    };

    const assignSlot = (contestantId, slot) => {
        setSlots({ ...slots, [contestantId]: slot });
    };

    return (
        <div className="container">
            <Title mb="lg" order={2}>Organizer Dashboard</Title>

            <Card shadow="sm" padding="lg" mb="lg">
                <Title order={4} mb="md"><IconPlus size={20} /> Create Competition Round</Title>
                <TextInput
                    label="Round Name"
                    placeholder="Enter round name"
                    mb="md"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            addRound(e.target.value);
                            e.target.value = '';
                        }
                    }}
                />
                <Button onClick={() => addRound(document.querySelector('input').value)}>Add Round</Button>
            </Card>

            <Card shadow="sm" padding="lg" mb="lg">
                <Title order={4} mb="md"><IconUser size={20} /> Registered Contestants</Title>
                <List>
                    {contestants.map(contestant => (
                        <List.Item key={contestant.id}>{contestant.name}</List.Item>
                    ))}
                </List>
            </Card>

            <Card shadow="sm" padding="lg">
                <Title order={4} mb="md"><IconCalendar size={20} /> Assign Performance Slots</Title>
                <Grid>
                    {contestants.map(contestant => (
                        <Grid.Col span={6} key={contestant.id}>
                            <Group>
                                <TextInput
                                    label={contestant.name}
                                    placeholder="Enter slot"
                                    onChange={(e) => assignSlot(contestant.id, e.target.value)}
                                />
                            </Group>
                        </Grid.Col>
                    ))}
                </Grid>
            </Card>
        </div>
    );
}