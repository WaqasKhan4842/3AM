import { Card, Select, Textarea, FileInput, Button, Title } from '@mantine/core';
import { IconMusic, IconUpload } from '@tabler/icons-react';

export function CompetitionSignUp() {
    return (
        <div className="container">
            <Card shadow="sm" padding="lg" style={{ maxWidth: 600, margin: 'auto' }}>
                <Title order={2} mb="md">Sign Up for a Competition</Title>

                <Select
                    label="Select Competition"
                    placeholder="Choose a competition"
                    data={[
                        { value: 'pop_classics', label: 'Pop Classics' },
                        { value: 'rock_legends', label: 'Rock Legends' },
                        { value: 'jazz_fusion', label: 'Jazz Fusion' },
                    ]}
                    icon={<IconMusic size={14} />}
                    mb="md"
                />

                <Textarea
                    label="Song Preferences"
                    placeholder="List your preferred songs for the competition"
                    mb="md"
                />

                <FileInput
                    label="Upload Song File"
                    placeholder="Choose an MP3/MP4 file"
                    accept="audio/mp3,video/mp4"
                    icon={<IconUpload size={14} />}
                    mb="md"
                />

                <Button fullWidth>
                    Submit Competition Entry
                </Button>
            </Card>
        </div>
    );
}