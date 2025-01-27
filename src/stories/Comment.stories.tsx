import { Meta, StoryObj } from '@storybook/react';
import Comment from '@components/Comment';

const meta = {
  title: 'Comment',
  component: Comment,
  tags: ['autodocs'],
  argTypes: {
    nickname: { control: 'text' },
    content: { control: 'text' },
    postedDate: { control: 'text' },
    active: { control: 'boolean' },
  },
  args: {
    nickname: '@khakhiD',
    content: '댓글 임시 내용',
    postedDate: '2023-08-29T09:28:39.390Z',
    active: true,
  },
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultComment: Story = {
  args: {
    active: false,
  },
};

export const MyComment: Story = {
  args: {
    active: true,
  },
};
