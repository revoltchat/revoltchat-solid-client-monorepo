import { Link } from "@revolt/routing";
import { Channel } from "revolt.js";
import { For, Match, Show, Switch } from "solid-js";
import { Avatar } from "../../design/atoms/display/Avatar";
import { Typography } from "../../design/atoms/display/Typography";
import { UserStatusGraphic } from "../../design/atoms/indicators";
import { MenuButton } from "../../design/atoms/inputs/MenuButton";
import { Column } from "../../design/layout";
import { OverflowingText } from "../../design/layout/OverflowingText";
import { SidebarBase } from "./common";
import { useQuantity, useTranslation } from "@revolt/i18n";
import { ScrollContainer } from "../../common/ScrollContainers";
import { TextWithEmoji } from "@revolt/markdown";

interface Props {
  /**
   * Ordered list of conversations
   */
  conversations: () => Channel[];

  /**
   * Current channel ID
   */
  channelId: string;
}

/**
 * Single conversation entry
 */
function Entry(props: { channel: Channel; active: boolean }) {
  const q = useQuantity();
  const t = useTranslation();
  const dm = props.channel.recipient;

  const status =
    dm?.status?.text ??
    (dm?.status?.presence === "Focus" ? t("app.status.focus") : undefined);

  return (
    <Link href={`/channel/${props.channel._id}`}>
      <MenuButton
        size="normal"
        alert={
          !props.active &&
          props.channel.unread &&
          (props.channel.mentions.length || true)
        }
        attention={
          props.active ? "selected" : props.channel.unread ? "active" : "normal"
        }
        icon={
          <Switch>
            <Match when={props.channel.channel_type === "Group"}>
              <Avatar
                size={32}
                fallback={props.channel.name}
                src={props.channel.generateIconURL({ max_side: 256 })}
              />
            </Match>
            <Match when={props.channel.channel_type === "DirectMessage"}>
              <Avatar
                size={32}
                src={
                  dm?.generateAvatarURL({ max_side: 256 }) ??
                  dm?.defaultAvatarURL
                }
                holepunch="bottom-right"
                overlay={
                  <UserStatusGraphic
                    status={dm?.status?.presence ?? "Invisible"}
                  />
                }
              />
            </Match>
          </Switch>
        }
      >
        <Column gap="none">
          <Switch>
            <Match when={props.channel.channel_type === "Group"}>
              <OverflowingText>
                <TextWithEmoji content={props.channel.name!} />
              </OverflowingText>
              <Typography variant="legacy-settings-description">
                {q("members", props.channel.recipient_ids?.length || 0)}
              </Typography>
            </Match>
            <Match when={props.channel.channel_type === "DirectMessage"}>
              <OverflowingText>{dm?.username}</OverflowingText>
              <Show when={status}>
                <Typography variant="legacy-settings-description">
                  <OverflowingText>
                    <TextWithEmoji content={status!} />
                  </OverflowingText>
                </Typography>
              </Show>
            </Match>
          </Switch>
        </Column>
      </MenuButton>
    </Link>
  );
}

/**
 * Display home navigation and conversations
 */
export const HomeSidebar = (props: Props) => {
  const t = useTranslation();

  return (
    <SidebarBase>
      <p>
        <Typography variant="legacy-settings-title">
          {t("app.main.categories.conversations")}
        </Typography>
      </p>
      <ScrollContainer>
        <Column>
          <div />
          <For each={props.conversations()}>
            {(channel) => (
              <Entry
                channel={channel}
                active={channel._id === props.channelId}
              />
            )}
          </For>
          <div />
        </Column>
      </ScrollContainer>
    </SidebarBase>
  );
};
