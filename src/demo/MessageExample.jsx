import React, { Component, PropTypes } from 'react';
import FormattedMessage from '../FormattedMessage';
import getVariableModifiers from '../getVariableModifiers';

export default class MessageExample extends Component {
  static propTypes = {
    message: PropTypes.string,
    i18n: PropTypes.shape({
      locales: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
      ]),
      formats: PropTypes.object
    }),
    values: PropTypes.object
  }

  render() {
    const { message, i18n, values } = this.props;

    const getBoldStyle = varArgs => ({
      fontWeight: varArgs.indexOf('bold') !== -1 ? 'bold' : undefined
    });

    return (
      <div className='panel panel-default'>
        <FormattedMessage message={message}
                          i18n={i18n}
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
            (id, varArgs, children) => {
              switch (id) {
              case 'nameLink':
                return (
                  <a href='#' style={getBoldStyle(varArgs)}>{children}</a>
                );
              case 'name':
                return (
                  <span>{children}</span>
                );
              default:
                return (
                  <span className='text-success' style={getBoldStyle(varArgs)}>{children}</span>
                );
              }
            }
          )}
        </FormattedMessage>
      </div>
    );
  }
}
