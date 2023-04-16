import { For, createSignal } from 'solid-js';

function ForumPage() {
  const [topics, setTopics] = createSignal([
    {
      title: 'Example Topic',
      author: 'User1',
      content: 'What are some good food places around XXX?',
    },
  ]);

  const [newTopic, setNewTopic] = createSignal({
    title: '',
    author: '',
    content: '',
  });

  const [comment, setComments] = createSignal([
    {
      reply: 'Comment to Example Topic',
      author: 'User2',
      content: 'This is my response.',
    },
  ]);

  const [newComment, setNewComment] = createSignal({
    reply: 'Comment to ',
    author: '',
    content: '',
  });

  function addTopic() {
    setTopics([...topics(), newTopic()]);
    setNewTopic({
      title: '',
      author: '',
      content: '',
    });
  }

  function addComment() {
    setComments([...comment(), newComment()]);
    setNewComment({
      reply: 'Comment to ',
      author: '',
      content: '',
    });
  }

  return (
    <div>
      <h1>Forum</h1>
      <ul>
        <For each={topics()}>
          {(topic) => (
            <li>
              <h2>{topic.title}</h2>
              <p>Author: {topic.author}</p>
              <p>{topic.content}</p>
            </li>
          )}
        </For>
        <For each={comment()}>
          {(topic) => (
            <li>
              <h2>{topic.reply}</h2>
              <p>Author: {topic.author}</p>
              <p>{topic.content}</p>
            </li>
          )}
        </For>
      </ul>
      <h2>New Topic</h2>
      <form>
        <label>
          Title:
          <textarea
            value={newTopic().title}
            onInput={(e) =>
              setNewTopic({
                ...newTopic(),
                title: e.target.value,
              })
            }
          />
        </label>
        <label>
          Author:
          <textarea
            value={newTopic().author}
            onInput={(e) =>
              setNewTopic({
                ...newTopic(),
                author: e.target.value,
              })
            }
          />
        </label>
        <label>
          Content:
          <textarea
            value={newTopic().content}
            onInput={(e) =>
              setNewTopic({
                ...newTopic(),
                content: e.target.value,
              })
            }
          />
        </label>
        <button type="button" onClick={addTopic}>
          Add Topic
        </button>
      </form>
      <h2>New Comment</h2>
      <form>
        <label>
          Original Topic:
          <input
            type="text"
            value={newComment().reply}
            onInput={(e) =>
              setNewComment({
                ...newComment(),
                reply: e.target.value,
              })
            }
          />
        </label>
        <label>
          Author:
          <input
            type="text"
            value={newComment().author}
            onInput={(e) =>
              setNewComment({
                ...newComment(),
                author: e.target.value,
              })
            }
          />
        </label>
        <label>
          Content:
          <textarea
            value={newComment().content}
            onInput={(e) =>
              setNewComment({
                ...newComment(),
                content: e.target.value,
              })
            }
          />
        </label>
        <button type="button" onClick={addComment}>
          Add Comment
        </button>
      </form>
    </div>
  );
}

export default ForumPage;
