Chat Notifications
==================

ExtPlug plugin that shows additional notification messages in chat when users
join or leave, grab, meh or woot a song, and when the next song starts.
(Woot notifications are disabled by default.)

![Chat Notifications](http://i.imgur.com/X1GzDBC.png)

## Installation

You can install this plugin by going to your ExtPlug settings menu, pressing
"Install Plugin", and entering this Plugin URL:

```
https://extplug.github.io/chat-notifications/build/chat-notifications.js;extplug/chat-notifications/main
```

## Room Settings

**Note: This section is intended for room hosts only.**

You can add custom [Room Styles](https://github.com/ExtPlug/room-styles) for
notification messages. The different message CSS classes are:

 * `.extplug-user-join`
 * `.extplug-user-leave`
 * `.extplug-grab`
 * `.extplug-woot`
 * `.extplug-meh`
 * `.extplug-advance`

Example to give meh notifications a painful red background:

```json
{
  "css": {
    "rule": {
      ".extplug-meh": { "background": "#f00" }
    }
  }
}
```

## Building

**Note: this section is intended for developers only.**

This plugin uses NPM for dependency management and `gulp` for building.

```
npm install
gulp build
```

The built plugin will be stored at `build/chat-notifications.js`.

## License

[MIT](./LICENSE)

