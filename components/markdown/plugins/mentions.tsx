import { RE_MENTIONS } from "revolt.js";
import { useParams } from "@revolt/routing";
import { styled } from "solid-styled-components";
import { Avatar, ColouredText } from "@revolt/ui";
import { clientController } from "@revolt/client";

import { createComponent, CustomComponentProps } from "./remarkRegexComponent";

const Mention = styled.a`
  gap: 4px;
  flex-shrink: 0;
  padding-left: 2px;
  padding-right: 6px;
  align-items: center;
  display: inline-flex;
  vertical-align: middle;

  cursor: pointer;

  font-weight: 600;
  text-decoration: none !important;
  border-radius: ${(props) => props.theme!.borderRadius.lg};
  background: ${(props) => props.theme!.colours["background-100"]};

  transition: 0.1s ease filter;

  &:hover {
    filter: brightness(0.75);
  }

  &:active {
    filter: brightness(0.65);
  }

  svg {
    width: 1em;
    height: 1em;
  }
`;

export function RenderMention({ match }: CustomComponentProps) {
  const client = clientController.getAvailableClient();
  const user = client.users.get(match)!;
  const { server } = useParams<{ server: string }>();

  let colour: string | undefined;
  if (server) {
    colour = client.members.getKey({ server, user: user._id })?.roleColour!;
  }

  return (
    <Mention>
      <Avatar size={16} src={user.avatarURL} />
      <ColouredText colour={colour} clip={colour?.includes("gradient")}>
        {user.username}
      </ColouredText>
    </Mention>
  );
}

export const remarkMention = createComponent("mention", RE_MENTIONS, (match) =>
  clientController.getAvailableClient()?.users.has(match)
);
