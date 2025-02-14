import { Card, Grid, Title, Text, Progress, Timeline, FileInput, Button, List } from '@mantine/core';
import { IconMusic, IconUpload, IconCalendar, IconPlus, IconUser, IconClock } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function ContestantDashboard() {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([
        { round: 'Round 1 - Auditions', deadline: 'Jan 15, 2024', status: 'Submitted' },
        { round: 'Round 2 - Cover Challenge', deadline: 'Feb 10, 2024', status: 'Pending' },
        { round: 'Round 3 - Pop Classics', deadline: 'Feb 28, 2024', status: 'Pending' },
    ]);

    return (
        <div className="container">
            <Title mb="lg" order={2}>My Competition Dashboard</Title>

            <Button
                leftIcon={<IconPlus size={16} />}
                onClick={() => navigate('/competition-signup')}
                mb="lg"
            >
                Sign Up for a Competition
            </Button>

            <Button
                leftIcon={<IconUser size={16} />}
                onClick={() => navigate('/profile-creation')}
                mb="lg"
            >
                Create Profile
            </Button>

            <Grid>
                <Grid.Col span={4}>
                    <Card shadow="sm" padding="lg">
                        <Title order={4} mb="md"><IconMusic size={20} /> Current Round</Title>
                        <Text weight={500}>Round 3: Pop Classics</Text>
                        <Text size="sm" color="dimmed">Deadline: Feb 28, 2024</Text>
                        <Progress mt="md" value={65} label="65% Completed" size="lg" />
                    </Card>
                </Grid.Col>

                <Grid.Col span={8}>
                    <Card shadow="sm">
                        <Title order={4} mb="md"><IconCalendar size={20} /> Performance Timeline</Title>
                        <Timeline active={2} bulletSize={24}>
                            <Timeline.Item title="Round 1 - Auditions" />
                            <Timeline.Item title="Round 2 - Cover Challenge" />
                            <Timeline.Item title="Round 3 - Pop Classics" />
                            <Timeline.Item title="Finals - Original Composition" />
                        </Timeline>
                    </Card>
                </Grid.Col>

                <Grid.Col span={12}>
                    <Card shadow="sm" mt="md">
                        <Title order={4} mb="md"><IconUpload size={20} /> Submit Performance</Title>
                        <FileInput
                            placeholder="Upload MP3/MP4 file"
                            accept="audio/mp3,video/mp4"
                            icon={<IconUpload size={14} />}
                        />
                        <Button mt="md" leftIcon={<IconUpload size={16} />}>
                            Submit Entry
                        </Button>
                    </Card>
                </Grid.Col>

                <Grid.Col span={12}>
                    <Card shadow="sm" mt="md">
                        <Title order={4} mb="md"><IconClock size={20} /> Submission Deadlines & Status</Title>
                        <List>
                            {submissions.map((submission, index) => (
                                <List.Item key={index}>
                                    <Text weight={500}>{submission.round}</Text>
                                    <Text size="sm" color="dimmed">Deadline: {submission.deadline}</Text>
                                    <Text>Status: {submission.status}</Text>
                                </List.Item>
                            ))}
                        </List>
                    </Card>
                </Grid.Col>
            </Grid>
        </div>
    );
}