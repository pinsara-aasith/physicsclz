import { useLink } from "@refinedev/core";
import { theme } from "antd";

import { SmallLogoIcon, UshanKolamunnaPhysicsIcon } from "..";
import { Logo } from "./styled";

const { useToken } = theme;

type TitleProps = {
    collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
    const { token } = useToken();
    const Link = useLink();

    return (
        <Logo>
            <Link to="/">
                {collapsed ? (
                    <SmallLogoIcon
                        style={{
                            fontSize: "32px",
                            color: token.colorTextHeading,
                        }}
                    />
                ) : (
                    <UshanKolamunnaPhysicsIcon style={{ color: token.colorTextHeading, width: "160px" }} />
                )}
            </Link>
        </Logo>
    );
};
