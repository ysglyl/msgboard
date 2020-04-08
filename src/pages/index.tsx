import React from 'react';
import {Button, Comment, Input, List, message, Tooltip} from 'antd';
import {DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined, ReloadOutlined} from '@ant-design/icons';
import styles from './index.less';
import {connect} from "umi";

import {max, min} from '../utils/tool.js';

const {TextArea} = Input;

class Index extends React.PureComponent {

  state = {
    refreshPage: false,
    msg: '',
    total: 0,
    minId: null,
    maxId: null,
    list: [],
    loadingData: false
  }

  componentDidMount(): void {
    this.loading(0)
    document.addEventListener('scroll', this.scroll)
  }

  loading = (type: any) => {
    const {maxId, minId, total, loadingData} = this.state;
    if (loadingData) {
      return;
    }
    // @ts-ignore
    const {dispatch} = this.props;
    this.setState({
      loadingData: true
    })
    dispatch({
      type: "message/messagePageListWithCallback",
      payload: {
        maxId: type === 0 ? maxId : null,
        minId: type === 1 ? minId : null
      },
      callback: (res: any) => {
        if (res.code === 200) {
          if (res.data.records.length > 0) {
            const {list, refreshPage} = this.state;
            if (type === 0) { // 刷新
              const newState = {
                refreshPage: !refreshPage,
                list: [...res.data.records, ...list],
                maxId: max(res.data.records, 'rowId')
              }
              if (total === 0) {
                newState.total = res.data.total;
              } else {
                newState.total = total + res.data.total;
              }
              if (minId == null) {
                newState.minId = min(res.data.records, 'rowId')
              }
              this.setState(newState)
            } else if (type === 1) { // 加载更多
              const newState = {
                refreshPage: !refreshPage,
                list: [...list, ...res.data.records],
                minId: min(res.data.records, 'rowId')
              }
              if (maxId == null) {
                newState.maxId = max(res.data.records, 'rowId')
              }
              this.setState(newState)
            }
          }
        }
        this.setState({
          loadingData: false
        })
      }
    })
  }

  save = () => {
    const {msg} = this.state;
    if (msg.length < 10) {
      message.info("多写几个字吧～");
      return;
    }
    // @ts-ignore
    const {dispatch} = this.props;
    dispatch({
      type: "message/messageSave",
      payload: {
        message: msg
      },
      callback: (res: any) => {
        if (res.code === 200) {
          this.setState({
            msg: ''
          });
          this.loading(0)
        }
      }
    })
  }

  update = (id: any, type: any) => {
    console.log("1")
    const {dispatch} = this.props;
    dispatch({
      type: "message/messageUpdate",
      payload: {
        id, type
      }
    })
  }

  scroll = () => {
    // 页面总高度
    const totalHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
    // 窗口可见高度
    const clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
    // 已滚动的高度
    const scrollHeight = document.body.scrollTop || document.documentElement.scrollTop;
    if (totalHeight - clientHeight - scrollHeight < 10) {
      this.loading(1);
    }
  }

  render() {
    const {msg, total, list, refreshPage} = this.state
    return (
      <div onScroll={this.scroll}>
        <div className={styles.msgContainer}>
          <List
            header={<div>
              <span>共{total}条留言</span>
              <Button type={'link'} onClick={() => this.loading(0)}>
                <ReloadOutlined />
              </Button>
            </div>}
            itemLayout="horizontal"
            dataSource={list}
            renderItem={item => (
              <li>
                <Comment
                  actions={[
                    <span key="comment-basic-like">
                      <Tooltip title="赞同">
                        {item.flagAgree ? (<LikeFilled />) : (
                          <LikeOutlined onClick={() => {
                            if (item.flagOppose) {
                              return;
                            }
                            item.agree = item.agree + 1;
                            item.flagAgree = true;
                            this.setState({
                              refreshPage: !refreshPage
                            });
                            this.update(item.rowId, 0);
                          }} />
                        )}
                      </Tooltip>
                      <span className="comment-action">{item.agree}</span>
                    </span>,
                    <span key=' key="comment-basic-dislike"'>
                      <Tooltip title="反对">
                        {item.flagOppose ? (<DislikeFilled />) : (
                          <DislikeOutlined onClick={() => {
                            if (item.flagAgree) {
                              return;
                            }
                            item.oppose = item.oppose + 1;
                            item.flagOppose = true;
                            this.setState({
                              refreshPage: !refreshPage
                            });
                            this.update(item.rowId, 1)
                          }} />
                        )}
                      </Tooltip>
                      <span className="comment-action">{item.oppose}</span>
                    </span>
                  ]}
                  author={item.author}
                  content={item.message}
                  datetime={item.createTime}
                />
              </li>
            )}
          />
        </div>
        <div className={styles.msgInputContainer}>
          <TextArea rows={4} value={msg} onChange={e => {
            this.setState({
              msg: e.target.value
            })
          }} />
          <Button type="primary" size={"large"} block style={{marginTop: 3}} onClick={() => this.save()}>
            留言
          </Button>
        </div>
      </div>
    );
  }
}

// @ts-ignore
export default connect(({message}) => ({message}))(Index);
