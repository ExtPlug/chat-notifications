Chat Notifications
==================

ExtPlug plugin that shows additional notification messages in chat when users
join or leave, grab, meh or woot a song, and when the next song starts.
(Woot notifications are disabled by default.)

![Chat Notifications](https://i.imgur.com/MEsolUY.png)

## Installation

If you do not have ExtPlug yet, get it [here](https://extplug.github.io).

You can install this plugin by going to your ExtPlug settings menu, pressing
"Install Plugin", and entering this Plugin URL:

```
https://unpkg.com/extplug-chat-notifications
```

## Room Settings

**Note: This section is intended for room hosts only.**

You can add custom [Room Styles](https://github.com/ExtPlug/room-styles)
for notification messages. All notification messages have the
`.cm.extplug-notification` CSS class. Different notification types also
get their own CSS classes:

 * `.extplug-user-join`, plus `.extplug-friend-join` for friends
 * `.extplug-user-leave`, plus `.extplug-friend-leave` for friends
 * `.extplug-grab`
 * `.extplug-woot`
 * `.extplug-meh`
 * `.extplug-advance`

Example to give meh notifications a painful red background:

```json
{
  "css": {
    "rule": {
      ".cm.extplug-meh": { "background": "#f00" }
    }
  }
}
```

## Building

**Note: this section is intended for developers only.**

First, install dependencies:

```bash
npm install
```

Then, use:

```bash
npm run build
```

The plugin will be built using the [ExtPlug CLI](https://github.com/extplug/extplug-cli).

The built plugin will be stored at `build/chat-notifications.js`.

## License

[MIT](./LICENSE)
