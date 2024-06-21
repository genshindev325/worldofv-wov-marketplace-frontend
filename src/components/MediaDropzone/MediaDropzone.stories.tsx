import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useDropzone } from "../../hooks/useDropzone";
import MediaDropzone from "./MediaDropzone";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/MediaDropzone",
    component: MediaDropzone,
    argTypes: {},
} as ComponentMeta<typeof MediaDropzone>;

export interface TokenInfo {
    file: File;
    name: string | null;
}

const Template: ComponentStory<typeof MediaDropzone> = ({
    onDrop,
    onRemove,
    onClear,
    ...args
}) => {
    const { files, handleDrop, handleRemove, handleClear } = useDropzone();
    // const [tokens, setTokens] = useState<TokenInfo[]>([]);

    // const insertTokens = (values: Partial<TokenInfo>[]) => {
    //     const items = values.map((v) => ({
    //         file: v.file!,
    //         name: v.name ?? null,
    //     }));

    //     const sorted = items
    //         .concat(tokens)
    //         .sort((a, b) => a.file.name.localeCompare(b.file.name));

    //     setTokens(sorted);
    // };

    // const removeToken = (index: number) => {
    //     setTokens([...tokens.slice(0, index), ...tokens.slice(index + 1)]);
    // };

    // const files = useMemo(() => tokens.map((t) => t.file), [tokens]);

    // const handleDrop = (files: File[]) => {
    //     insertTokens(files.map((file) => ({ file })));
    // };

    // const handleRemove = (file: File) => {
    //     removeToken(tokens.findIndex((t) => t.file.name === file.name));
    // };

    // const handleClear = () => {
    //     setTokens([]);
    // };

    return (
        <MediaDropzone
            {...args}
            files={files}
            onDrop={handleDrop}
            onRemove={handleRemove}
            onClear={handleClear}
        />
    );
};

export const Default = Template.bind({});
Default.args = {
    supportedMimeTypes: ["image/jpeg", "image/png", "video/mp4"],
    maxFileCount: 3,
    maxFileSizeBytes: 10 * 1024 * 1024,
};
