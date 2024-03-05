import React from 'react';
import { useCountdown } from './useCountdown';
import { Box, Button, Group, Progress, Stack, Title } from '@mantine/core';

const delay: number = 5 * 1000;

const Test: React.FC = () => {
    const { remainingTime, paused, ended, actions } = useCountdown(
        delay,
        1000,
        () => console.log('END via callback'),
        { autoInvoke: false }
    );

    React.useEffect(() => {
        true === ended &&
            console.log('END via state');
    }, [ended]);

    return (
        <>
            <Stack py='xl' align='center'>
                <Title order={1}>
                    {(remainingTime / 1000).toFixed(2)}
                </Title>
                <Group>
                    <Button onClick={() => actions.start()}>
                        {`Start`}
                    </Button>
                    <Button onClick={() => actions.start(delay/2)}>
                        {`Start at (delay / 2)`}
                    </Button>
                    <Button onClick={() => paused ? actions.resume() : actions.pause()}>
                        {paused ? 'Resume' : 'Pause'}
                    </Button>
                    <Button onClick={() => actions.reset()}>
                        {`Reset`}
                    </Button>
                </Group>
            </Stack>
            <Box px='xl'>
                <Progress
                    color='yellow'
                    size='lg'
                    radius='lg'
                    value={100 - remainingTime * 100 / delay}
                    transitionDuration={1000}
                />
            </Box>
        </>
    );
};

export default Test;
