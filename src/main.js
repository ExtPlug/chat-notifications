import Plugin from 'extplug/Plugin';
import Events from 'plug/core/Events';
import friends from 'plug/collections/friends';

const isFriend = (id) => !!friends.get(id);

const ChatNotifications = Plugin.extend({
  name: 'Chat Notifications',
  description: 'Shows notification messages in chat for useful events',

  settings: {
    userJoin: { type: 'boolean', label: 'User Join', default: true },
    friendJoin: { type: 'boolean', label: 'Friend Join', default: true },
    userLeave: { type: 'boolean', label: 'User Leave', default: true },
    friendLeave: { type: 'boolean', label: 'Friend Leave', default: true },
    advance: { type: 'boolean', label: 'DJ Advance', default: true },
    grab: { type: 'boolean', label: 'Media Grab', default: true },
    meh: { type: 'boolean', label: 'Meh Vote', default: true },
    woot: { type: 'boolean', label: 'Woot Vote', default: false },

    userJoinColor: { type: 'color', label: 'User Join Color', default: '#2ecc40' },
    userLeaveColor: { type: 'color', label: 'User Leave Color', default: '#ff851b' },
    advanceColor: { type: 'color', label: 'DJ Advance Color', default: '#7fdbff' },
    grabColor: { type: 'color', label: 'Grab Color', default: '#a670fe' },
    mehColor: { type: 'color', label: 'Meh Color', default: '#ff4136' },
    wootColor: { type: 'color', label: 'Woot Color', default: '#90ad2f' },

    inline: { type: 'boolean', label: 'Small Notifications', default: true },
    showTitle: {
      type: 'boolean',
      label: 'Show song titles',
      description: 'Display the title of the playing song in grab and vote notifications.',
      default: true
    }
  },

  style: {
    '.cm.extplug-notification': { 'min-height': '46px' },
    /* Default styles. */
    '.cm.extplug-user-join .msg':  { 'color': '#2ecc40' },
    '.cm.extplug-user-leave .msg': { 'color': '#ff851b' },
    '.cm.extplug-advance .msg':    { 'color': '#7fdbff' },
    '.cm.extplug-grab .msg':       { 'color': '#a670fe' },
    '.cm.extplug-meh .msg':        { 'color': '#ff4136' },
    '.cm.extplug-woot .msg':       { 'color': '#90ad2f' }
  },

  enable() {
    this._super();
    this.listenTo(API, API.USER_JOIN, this.onJoin);
    this.listenTo(API, API.BEFORE_USER_LEAVE, this.onLeave);
    this.listenTo(API, API.ADVANCE, this.onAdvance);
    this.listenTo(API, API.GRAB_UPDATE, this.onGrab);
    this.listenTo(API, API.VOTE_UPDATE, this.onVote);
    this.settings.on([
      'change:userJoinColor',
      'change:userLeaveColor',
      'change:advanceColor',
      'change:grabColor',
      'change:mehColor',
      'change:wootColor'
    ].join(' '), this.updateStyles, this);
    this.updateStyles();
  },

  updateStyles() {
    this.removeStyles();

    const colorOf = (name) => ({
      color: this.settings.get(`${name}Color`)
    });
    this.createStyle({
      '.cm.extplug-user-join .msg':  colorOf('userJoin'),
      '.cm.extplug-user-leave .msg': colorOf('userLeave'),
      '.cm.extplug-advance .msg':    colorOf('advance'),
      '.cm.extplug-grab .msg':       colorOf('grab'),
      '.cm.extplug-meh .msg':        colorOf('meh'),
      '.cm.extplug-woot .msg':       colorOf('woot')
    });
  },

  _class() {
    const inline = this.settings.get('inline');
    return `${inline ? 'inline ' : ''}`;
  },

  _title() {
    if (this.settings.get('showTitle')) {
      const media = API.getMedia()
      return `${media.author} – ${media.title}`
    }
    return 'this track'
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
    } else if (this.settings.get('userJoin')) {
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
    } else if (this.settings.get('userLeave')) {
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
        message: `grabbed ${this._title()}`,
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
        message: `meh'd ${this._title()}`,
        uid: e.user.id,
        un: e.user.username,
        badge: 'icon-meh'
      });
    }
    if (this.settings.get('woot') && e.vote === 1) {
      Events.trigger('chat:receive', {
        type: 'extplug-notification',
        classes: `${this._class()} extplug-woot`,
        message: `wooted ${this._title()}`,
        uid: e.user.id,
        un: e.user.username,
        badge: 'icon-woot'
      });
    }
  }
});

export default ChatNotifications;
