import React, { Component, PropTypes } from 'react';
import FormattedMessage from '../src/FormattedMessage';
import getVariableModifiers from '../src/getVariableModifiers';

export default class MessageExample extends Component {
  static propTypes = {
    locale: PropTypes.string,
    lang: PropTypes.func,
    values: PropTypes.object
  }

  static defaultProps = {
    locale: 'en-US'
  }

  render() {
    const { locale, lang, values } = this.props;

    const getBoldStyle = modifiers => ({
      fontWeight: modifiers.indexOf('bold') !== -1 ? 'bold' : undefined
    });

    return (
      <div className='panel panel-default'>
        <FormattedMessage message={lang('text')}
                          i18n={{ locales: [locale] }}
                          getValue={getVariableModifiers(id =>
                            values[id] !== undefined ? values[id] : id)
                          }
                          getRootComponent={children =>
                              <div className='panel-body'>{children}</div>
                          }
                          onRenderError={(e, msg) =>
                            <div className='alert alert-warning'>{e.message}<br/>{msg}</div>
                          }>
          {getVariableModifiers(
            (id, modifiers, children) => {
              switch (id) {
              case 'nameLink':
                return (
                  <a href='#' style={getBoldStyle(modifiers)}>{children}</a>
                );
              case 'name':
                return (
                  <span>{children}</span>
                );
              default:
                return (
                  <span className='text-success' style={getBoldStyle(modifiers)}>{children}</span>
                );
              }
            }
          )}
        </FormattedMessage>
      </div>
    );
  }
}
