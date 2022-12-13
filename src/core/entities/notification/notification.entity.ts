import { randomUUID } from 'node:crypto';
import { Content } from './content.entity';

interface NotificationProps {
  recipientId: string;
  category: string;
  content: Content;
  readAt?: Date | null;
  createdAt: Date;
}

export class Notification {
  private _id: string;
  private props: NotificationProps;

  constructor(props: Omit<NotificationProps, 'createdAt'>) {
    this._id = randomUUID();
    this.props = {
      ...props,
      createdAt: new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public get recipientId(): string {
    return this.props.recipientId;
  }

  public set recipientId(value: string) {
    this.props.recipientId = value;
  }

  public get category(): string {
    return this.props.category;
  }

  public set category(value: string) {
    this.props.category = value;
  }

  public get content(): Content {
    return this.props.content;
  }

  public set content(value: Content) {
    this.props.content = value;
  }

  public get readAt(): Date | null | undefined {
    return this.props.readAt;
  }

  public set readAt(value: Date | null | undefined) {
    this.props.readAt = value;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }
}
