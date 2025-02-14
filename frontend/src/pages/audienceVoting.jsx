import { useState, useEffect } from 'react';
import { Card, Button, Title, List, TextInput, Grid, Text } from '@mantine/core';
import { IconUser, IconMail } from '@tabler/icons-react';

export function AudienceVoting() {
    const [contestants, setContestants] = useState([
        { id: 1, name: 'Contestant 1', votes: 0 },
        { id: 2, name: 'Contestant 2', votes: 0 },
        // Add more contestants as needed
    ]);
    const [email, setEmail] = useState('');
    const [voted, setVoted] = useState(false);
    const [voteCounts, setVoteCounts] = useState({});

    // Fetch initial vote counts from the backend
    useEffect(() => {
        fetch('/api/vote-counts')
            .then((response) => response.json())
            .then((data) => setVoteCounts(data))
            .catch((error) => console.error('Error fetching vote counts:', error));
    }, []);

    const handleVote = (contestantId) => {
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (voted) {
            alert('You have already voted.');
            return;
        }

        fetch('/api/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, contestantId }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setVoted(true);
                    setVoteCounts(data.voteCounts); // Update vote counts
                    alert('Vote submitted successfully!');
                } else {
                    alert(data.message || 'Failed to submit vote.');
                }
            })
            .catch((error) => console.error('Error submitting vote:', error));
    };

    return (
        <div className="container">
            <Title mb="lg" order={2}>Audience Voting</Title>

            <Card shadow="sm" padding="lg" mb="lg">
                <Title order={4} mb="md"><IconMail size={20} /> Enter Your Email to Vote</Title>
                <TextInput
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<IconMail size={14} />}
                    mb="md"
                />
            </Card>

            <Card shadow="sm" padding="lg">
                <Title order={4} mb="md"><IconUser size={20} /> Contestants</Title>
                <List>
                    {contestants.map((contestant) => (
                        <List.Item key={contestant.id}>
                            <Grid align="center">
                                <Grid.Col span={6}>
                                    <Text weight={500}>{contestant.name}</Text>
                                    <Text size="sm" color="dimmed">Votes: {voteCounts[contestant.id] || 0}</Text>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Button
                                        onClick={() => handleVote(contestant.id)}
                                        disabled={voted}
                                    >
                                        Vote
                                    </Button>
                                </Grid.Col>
                            </Grid>
                        </List.Item>
                    ))}
                </List>
            </Card>
        </div>
    );
}