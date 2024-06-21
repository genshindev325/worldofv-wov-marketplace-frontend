import { useState } from "react";
import { Box } from "../../common/Box";
import { Divider } from "../../common/Divider";
import { Flex } from "../../common/Flex";
import { Modal } from "../../common/Modal";
import { Text } from "../../common/Text";
import Icon from "../../Icon";

interface VideoPlayerProps {
    src: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Flex>
                <Box
                    bg="primary"
                    py={3}
                    px={{ _: 3, m: 6 }}
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    <Text variant="bodyBold2" color="white">
                        Play video to see how it works
                    </Text>
                </Box>
                <Divider x color="background" width={2} />
                <Flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    bg="primary"
                    p={3}
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    <Icon icon="play" size={24} color="white" />
                </Flex>
            </Flex>
            <Modal
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
            >
                <Box display={{ _: "block", m: "none" }}>
                    <iframe
                        src={`${src}&autoplay=1&playsinline=0`}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </Box>
                <Box display={{ _: "none", m: "block" }}>
                    <iframe
                        src={`${src}&autoplay=1`}
                        width="832"
                        height="468"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </Box>
            </Modal>
        </>
    );
};
