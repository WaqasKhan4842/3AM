import { Card, Grid, Title, Text, Progress, Timeline, FileInput, Button } from '@mantine/core';
import { IconMusic, IconUpload, IconCalendar} from '@tabler/icons-react';

export function ContestantDashboard() {
    return (
        <div className="container">
            <Title mb="lg" order={2}>My Competition Dashboard</Title>

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
            </Grid>
        </div>
    );
}