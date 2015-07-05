define(function (require, exports, module) {

  const Plugin = require('extplug/Plugin');
  const Events = require('plug/core/Events');
  const friends = require('plug/collections/friends');

  const isFriend = id => !!friends.get(id)

  const ChatNotifications = Plugin.extend({
    name: 'Chat Notifications',
    description: 'Shows notification messages in chat for useful events',

    settings: {
      inline: { type: 'boolean', label: 'Small Notifications', default: true },
      userJoin: { type: 'boolean', label: 'User Join', default: true },
      friendJoin: { type: 'boolean', label: 'Friend Join', default: true },
      userLeave: { type: 'boolean', label: 'User Leave', default: true },
      friendLeave: { type: 'boolean', label: 'Friend Leave', default: true },
      advance: { type: 'boolean', label: 'DJ Advance', default: true },
      grab: { type: 'boolean', label: 'Media Grab', default: true },
      meh: { type: 'boolean', label: 'Meh Vote', default: true },
      woot: { type: 'boolean', label: 'Woot Vote', default: false }
    },

    init(id, ext) {
      this._super(id, ext);
      this.onJoin = this.onJoin.bind(this);
      this.onLeave = this.onLeave.bind(this);
      this.onAdvance = this.onAdvance.bind(this);
      this.onGrab = this.onGrab.bind(this);
      this.onVote = this.onVote.bind(this);
    },

    enable() {
      this._super();
      API.on(API.USER_JOIN, this.onJoin);
      API.on(API.BEFORE_USER_LEAVE, this.onLeave);
      API.on(API.ADVANCE, this.onAdvance);
      API.on(API.GRAB_UPDATE, this.onGrab);
      API.on(API.VOTE_UPDATE, this.onVote);

      this.Style({
        '.cm.extplug-user-join .msg':  { 'color': '#2ecc40' },
        '.cm.extplug-user-leave .msg': { 'color': '#ff851b' },
        '.cm.extplug-advance .msg':    { 'color': '#7fdbff' },
        '.cm.extplug-grab .msg':       { 'color': '#a670fe' },
        '.cm.extplug-meh .msg':        { 'color': '#ff4136' },
        '.cm.extplug-woot .msg':       { 'color': '#90ad2f' }
      });
    },

    disable() {
      this._super();
      API.off(API.USER_JOIN, this.onJoin);
      API.off(API.BEFORE_USER_LEAVE, this.onLeave);
      API.off(API.ADVANCE, this.onAdvance);
      API.off(API.GRAB_UPDATE, this.onGrab);
      API.off(API.VOTE_UPDATE, this.onVote);
    },

    _class() {
      let inline = this.settings.get('inline');
      return `${inline ? 'inline ' : ''}`;
    },

    onJoin(e) {
      if (this.settings.get('friendJoin') && isFriend(e.id)) {
        Events.trigger('chat:receive', {
          type: 'extplug-notification',
          classes: `${this._class()} extplug-user-join extplug-friend-join`,
          message: 'joined the room',
          uid: e.id,
          un: e.username,
          badge: ':heart:'
        })
      }
      else if (this.settings.get('userJoin')) {
        Events.trigger('chat:receive', {
          type: 'extplug-notification',
          classes: `${this._class()} extplug-user-join`,
          message: 'joined the room',
          uid: e.id,
          un: e.username,
          badge: 'icon-community-users'
        });
      }
    },

    onLeave(user) {
      if (this.settings.get('friendLeave') && isFriend(user.id)) {
        Events.trigger('chat:receive', {
          type: 'extplug-notification',
          classes: `${this._class()} extplug-user-leave extplug-friend-leave`,
          message: 'left the room',
          uid: user.id,
          un: user.username,
          badge: ':broken_heart:'
        })
      }
      else if (this.settings.get('userLeave')) {
        Events.trigger('chat:receive', {
          type: 'extplug-notification',
          classes: `${this._class()} extplug-user-leave`,
          message: 'left the room',
          uid: user.id,
          un: user.username,
          badge: 'icon-community-users'
        });
      }
    },

    onAdvance(e) {
      if (this.settings.get('advance')) {
        Events.trigger('chat:receive', {
          type: 'extplug-notification',
          classes: 'extplug-advance',
          message: `${e.media.author} – ${e.media.title}`,
          uid: e.dj.id,
          un: e.dj.username,
          badge: 'icon-play-next'
        });
      }
    },

    onGrab(e) {
      if (this.settings.get('grab')) {
        Events.trigger('chat:receive', {
          type: 'extplug-notification',
          classes: `${this._class()} extplug-grab`,
          message: 'grabbed this track',
          uid: e.user.id,
          un: e.user.username,
          badge: 'icon-grab'
        });
      }
    },

    onVote(e) {
      if (this.settings.get('meh') && e.vote === -1) {
        Events.trigger('chat:receive', {
          type: 'extplug-notification',
          classes: `${this._class()} extplug-meh`,
          message: 'meh\'d this track',
          uid: e.user.id,
          un: e.user.username,
          badge: 'icon-meh'
        });
      }
      if (this.settings.get('woot') && e.vote === 1) {
        Events.trigger('chat:receive', {
          type: 'extplug-notification',
          classes: `${this._class()} extplug-woot`,
          message: 'wooted this track',
          uid: e.user.id,
          un: e.user.username,
          badge: 'icon-woot'
        });
      }
    }
  });

  module.exports = ChatNotifications;

});
