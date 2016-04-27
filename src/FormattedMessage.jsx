import React, { Component, PropTypes } from 'react';
import createFormatCache from 'intl-format-cache';
import ReactMessageFormat from './ReactMessageFormat';

const getMessageFormat = createFormatCache(ReactMessageFormat);

const I18N_TYPE = PropTypes.shape({
  locales: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  formats: PropTypes.object
});

export default class FormattedMessage extends Component {
  constructor(props) {
    super(props);
    this.rootChildren = props.message;
    this.state = { messageFormat: null, renderError: null };
  }

  static propTypes = {
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    i18n: I18N_TYPE
  }

  static contextTypes = {
    i18n: I18N_TYPE
  }

  static defaultProps = {
    getValue(id, props) {
      return props[id];
    },

    getComponent(id, children) {
      return <span>{children}</span>;
    },

    getRootComponent(children) {
      return <span>{children}</span>;
    },

    onRenderError(e, message) {
      return <span>{message}</span>;
    },

    renderString(str) {
      return str;
    },

    i18n: {
      locales: 'en-US'
    }
  }

  getI18n(props) {
    return this.context.i18n || props.i18n;
  }

  componentWillMount() {
    const i18n = this.getI18n(this.props);

    this.requireLocales(i18n.locales);
    this.createMessageFormat(i18n, this.props);
  }

  componentWillUpdate(nextProps) {
    const nextI18n = this.getI18n(nextProps);
    const i18n = this.getI18n(this.props);

    if (nextI18n.locales !== i18n.locales) {
      this.requireLocales(nextI18n.locales);
    }

    if (nextI18n.locales !== i18n.locales ||
        nextI18n.formats !== i18n.formats ||
        nextProps.message !== this.props.message) {
      this.createMessageFormat(this.getI18n(nextProps), nextProps);
    }
  }

  requireLocales(locales) {
    if (!Array.isArray(locales)) {
      locales = [locales];
    }
    // TODO: support second-level locales
    locales.forEach(locale =>
      locale && require('intl-messageformat/dist/locale-data/' + locale.split('-')[0])
    );
  }

  createMessageFormat(i18n, props) {
    try {
      const messageFormat = getMessageFormat(props.message.toString(), i18n.locales, i18n.formats);
      this.setState({ messageFormat, renderError: null });
    } catch (e) {
      this.setState({ renderError: e });
    }
  }

  renderComponent = (id, children) => {
    const component = (this.props.children || this.props.getComponent)(id, children);
    return React.cloneElement(component, { key: component.props.key || `pagan-${id}` });
  }

  render() {
    const { getValue, getComponent, getRootComponent, renderString,
            children, message, onRenderError, ...props } = this.props;
    let rootChildren;

    if (this.state.renderError) {
      return onRenderError(this.state.renderError, message);
    }

    try {
      rootChildren = this.state.messageFormat.format({
        getValue,
        props,
        renderComponent: this.renderComponent,
        renderString
      });
    } catch (e) {
      return onRenderError(e, message);
    }

    return getRootComponent(rootChildren);
  }
}
