import { Card, Title, List, Text } from '@mantine/core';
import { IconTrophy, IconChartBar } from '@tabler/icons-react';

export function ResultsPage() {
    // Static data for contestants, rankings, and winners
    const rankings = [
        { contestantId: 1, name: 'Contestant 1', finalScore: 95 },
        { contestantId: 2, name: 'Contestant 2', finalScore: 92 },
        { contestantId: 3, name: 'Contestant 3', finalScore: 89 },
        { contestantId: 4, name: 'Contestant 4', finalScore: 85 },
        { contestantId: 5, name: 'Contestant 5', finalScore: 80 },
    ];

    return (
        <div className="container">
            <Title mb="lg" order={2}>Final Results</Title>

            {/* Winners Section */}
            <Card shadow="sm" padding="lg">
                <Title order={4} mb="md"><IconTrophy size={20} /> Winners</Title>
                <List>
                    {rankings.slice(0, 3).map((contestant, index) => (
                        <List.Item key={contestant.contestantId}>
                            <Text weight={500}>
                                {index + 1}. {contestant.name} - Final Score: {contestant.finalScore}
                            </Text>
                        </List.Item>
                    ))}
                </List>
            </Card>

            {/* Full Rankings Section */}
            <Card shadow="sm" padding="lg" mt="md">
                <Title order={4} mb="md"><IconChartBar size={20} /> Full Rankings</Title>
                <List>
                    {rankings.map((contestant, index) => (
                        <List.Item key={contestant.contestantId}>
                            <Text weight={500}>
                                {index + 1}. {contestant.name} - Final Score: {contestant.finalScore}
                            </Text>
                        </List.Item>
                    ))}
                </List>
            </Card>
        </div>
    );
}