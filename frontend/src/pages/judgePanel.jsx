import { useState, useEffect } from 'react';
import { Card, Button, Title, Grid, NumberInput, List } from '@mantine/core';
import { IconUser, IconMusic } from '@tabler/icons-react';

export function JudgePanel() {
    const [performances, setPerformances] = useState([
        { id: 1, name: 'Contestant 1', song: 'Song 1' },
        { id: 2, name: 'Contestant 2', song: 'Song 2' },
        // Add more performances as needed
    ]);
    const [scores, setScores] = useState({});
    const [leaderboard, setLeaderboard] = useState([]);

    const handleScoreChange = (performanceId, criteria, value) => {
        if (value < 0 || value > 10) return; // Ensure score is between 0 and 10
        setScores({
            ...scores,
            [performanceId]: {
                ...scores[performanceId],
                [criteria]: value,
            },
        });
    };

    const calculateLeaderboard = () => {
        const totalScores = performances.map(performance => {
            const score = scores[performance.id] || {};
            const total = (score.pitch || 0) + (score.tone || 0) + (score.stagePresence || 0) + (score.overallPerformance || 0);
            return { ...performance, total };
        });

        totalScores.sort((a, b) => b.total - a.total);
        setLeaderboard(totalScores);
    };

    useEffect(() => {
        calculateLeaderboard();
    }, [scores]);

    const submitScores = () => {
        console.log('Scores submitted:', scores);
        calculateLeaderboard();
    };

    return (
        <div className="container">
            <Title mb="lg" order={2}>Judge Panel</Title>

            {performances.map(performance => (
                <Card shadow="sm" padding="lg" mb="lg" key={performance.id}>
                    <Title order={4} mb="md">{performance.name} - {performance.song}</Title>
                    <Grid>
                        <Grid.Col span={6}>
                            <NumberInput
                                label="Pitch"
                                placeholder="Score for Pitch"
                                min={0}
                                max={10}
                                onChange={(value) => handleScoreChange(performance.id, 'pitch', value)}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <NumberInput
                                label="Tone"
                                placeholder="Score for Tone"
                                min={0}
                                max={10}
                                onChange={(value) => handleScoreChange(performance.id, 'tone', value)}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <NumberInput
                                label="Stage Presence"
                                placeholder="Score for Stage Presence"
                                min={0}
                                max={10}
                                onChange={(value) => handleScoreChange(performance.id, 'stagePresence', value)}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <NumberInput
                                label="Overall Performance"
                                placeholder="Score for Overall Performance"
                                min={0}
                                max={10}
                                onChange={(value) => handleScoreChange(performance.id, 'overallPerformance', value)}
                            />
                        </Grid.Col>
                    </Grid>
                </Card>
            ))}

            <Button onClick={submitScores}>Submit Scores</Button>

            <Title mt="lg" order={3}>Leaderboard</Title>
            <List>
                {leaderboard.map((contestant, index) => (
                    <List.Item key={contestant.id}>
                        {index + 1}. {contestant.name} - Total Score: {contestant.total}
                    </List.Item>
                ))}
            </List>
        </div>
    );
}