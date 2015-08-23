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

export default class Format extends Component {
  constructor(props) {
    super(props);
    this.rootChildren = props.text;
    this.state = { messageFormat: null };
  }

  static propTypes = {
    text: PropTypes.string,
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

    onRenderError(e, text) {
      return <span>{text}</span>;
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
        nextProps.text !== this.props.text) {
      this.createMessageFormat(this.getI18n(nextProps), nextProps);
    }
  }

  requireLocales(locales) {
    // TODO: support second-level locales
    require('intl-messageformat/dist/locale-data/' + locales.split('-')[0]);
  }

  createMessageFormat(i18n, props) {
    const messageFormat = getMessageFormat(props.text, i18n.locales, i18n.formats);

    this.setState({ messageFormat });
  }

  renderComponent = (id, children) => {
    const component = (this.props.children || this.props.getComponent)(id, children);
    return React.cloneElement(component, { key: component.props.key || `pagan-${id}` });
  }

  render() {
    const { getValue, getComponent, getRootComponent,
            children, text, onRenderError, ...props } = this.props;
    let rootChildren;

    try {
      rootChildren = this.state.messageFormat.format({
        getValue,
        props,
        renderComponent: this.renderComponent
      });
    } catch (e) {
      return onRenderError(e, text);
    }

    return getRootComponent(rootChildren);
  }
}
