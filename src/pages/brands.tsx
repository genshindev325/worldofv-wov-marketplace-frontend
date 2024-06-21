import { Box } from "@/components/common/Box";
import { Flex } from "@/components/common/Flex";
import { Grid } from "@/components/common/Grid";
import { Text } from "@/components/common/Text";
import Link from "@/components/Link";
import { GetAllBrandsQueryResult } from "@/generated/graphql";
import { GraphQLService } from "@/services/GraphQLService";
import { useMemo } from "react";
import styled from "styled-components";

const DESCRIPTION_MAX_LEN = 256;

export interface BrandsPageProps {
    brands: GetAllBrandsQueryResult["brands"];
}

export default function BrandsPage({ brands }: BrandsPageProps) {
    return (
        <Grid
            gridTemplateColumns="repeat(12, 1fr)"
            padding={{ _: 3, m: 4, t: 6 }}
            gridGap={4}
            justifyContent="center"
        >
            <Box gridColumn="span 12" pb={3}>
                <Text textAlign="center" variant="h1" fontSize={{ _: 7, m: 8 }}>
                    Explore Brands
                </Text>
            </Box>
            {brands.map((brand) => (
                <Brand key={brand.id} {...brand} />
            ))}
        </Grid>
    );
}

export async function getServerSideProps() {
    const { brands } = await GraphQLService.sdk().GetAllBrands();

    return {
        props: { brands },
    };
}

function Brand(brand: GetAllBrandsQueryResult["brands"][0]) {
    const description = useMemo(() => {
        let description = brand.description;

        if (brand.description.length > DESCRIPTION_MAX_LEN) {
            description = description.slice(0, DESCRIPTION_MAX_LEN) + "...";
        }

        return description;
    }, [brand.description]);

    return (
        <Box
            gridColumn={{
                _: "span 12",
                a: "span 6",
                t: "span 4",
                w: "span 3",
            }}
            borderWidth="1px"
            backgroundColor="highlight"
            borderStyle="solid"
            borderColor="muted"
            borderRadius={4}
            overflow="hidden"
            boxShadow={8}
        >
            <Link href={`collections?brand_id=${brand.id}`} passHref>
                <a>
                    <Flex flexDirection="column" height="100%">
                        <Thumbnail
                            src={brand.thumbnailImageUrl}
                            alt="brand image"
                        />
                        <Flex
                            flexDirection="column"
                            alignItems="center"
                            px={2}
                            py={4}
                            columnGap={2}
                            height="100%"
                        >
                            <Text
                                variant="bodyBold2"
                                fontSize={18}
                                color="text"
                            >
                                {brand.name}
                            </Text>
                            <Text
                                variant="caption2"
                                color="accent"
                                textAlign="center"
                                height="100%"
                            >
                                {description}
                            </Text>
                            <Text variant="hairline2">Explore</Text>
                        </Flex>
                    </Flex>
                </a>
            </Link>
        </Box>
    );
}

const Thumbnail = styled.img`
    width: 100%;
    min-height: 192px;
    height: 192px;
    object-fit: cover;
`;
