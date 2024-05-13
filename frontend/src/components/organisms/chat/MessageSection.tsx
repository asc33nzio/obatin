import { Message } from '@/styles/atoms/Message.styles';
import { MessageBungkus } from '@/styles/organisms/ChatRoomListContainer.styles';
import { IMessage } from '@/types/messageItf';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

interface IPropsMessage {
  message: IMessage[];
  role: string | undefined;
  onClickChildPrescription: (id: number) => void;
}

function MessageSection(props: IPropsMessage): React.ReactElement {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [lastMessageIndex, setLastMessageIndex] = useState<number | null>(null);
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };

    scrollToBottom();
  }, [props.message]);

  useEffect(() => {
    if (props.message.length > 0) {
      setLastMessageIndex(props.message.length - 1);
    }
  }, [props.message]);

  return (
    <div
      ref={scrollRef}
      style={{
        height: '65vh',
        overflowY: 'auto',
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        scrollbarWidth: 'none',
        padding: '10px 0',
      }}
    >
      {props.message?.map((msg, index) => (
        <MessageBungkus
          key={index}
          isLastMessage={index === lastMessageIndex}
          role={props.role ?? ''}
          sender={msg?.sender}
        >
          {(msg.message as string).includes('%prescription-doctor-obatin') ? (
            <div
              style={{
                minWidth: 'fit-content',
                minHeight: 'fit-content',
                backgroundColor:
                  msg.sender === props.role ? '#00B5C0' : '#FFFFFF',
                padding: '25px 10px',
                borderRadius: '10px',
              }}
            >
              <div
                style={{
                  height: '80%',
                  width: '90%',
                  top: '0',
                  left: '0',
                }}
              >
                <div
                  style={{
                    width: '350px',
                    height: '150px',
                    position: 'relative',
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    const id = msg.message.split('-').pop();
                    id && props.onClickChildPrescription(parseInt(id));
                  }}
                >
                  <Image
                    width={250}
                    height={100}
                    alt=''
                    src='https://res.cloudinary.com/dzoleanvi/image/upload/v1714035267/go-cloudinary/c2slpv9frkt9hkvsrqdm.jpg'
                    style={{ position: 'relative' }}
                  />
                  <div
                    style={{
                      width: '100%',
                      position: 'absolute',
                      height: '40px',
                      backgroundColor: 'black',
                      bottom: '0',
                      opacity: '0.5',
                      color: 'white',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 20px',
                      letterSpacing: '3px',
                    }}
                  >
                    Lihat resep
                  </div>
                </div>
              </div>
            </div>
          ) : msg.message.includes('https://res.cloudinary.com/') ? (
            <div>
              {msg.message.endsWith('.pdf') ? (
                <div>
                  <a
                    href={msg.message}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Lihat PDF
                  </a>
                </div>
              ) : (
                <div>
                  <Image src={msg.message} alt='' height={150} width={150} />
                </div>
              )}
            </div>
          ) : (
            <Message
              background_color={
                msg.sender === props.role ? '#00B5C0' : '#FFFFFF'
              }
              color={msg.sender === props.role ? '#FFFFFF' : '#00B5C0'}
            >
              {msg.message}
            </Message>
          )}

          <div style={{ fontSize: '14px', alignSelf: 'end' }}>
            {new Intl.DateTimeFormat('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }).format(new Date(msg.created_at))}
          </div>
        </MessageBungkus>
      ))}
    </div>
  );
}

export default MessageSection;
