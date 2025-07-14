import { gql } from "@apollo/client";

export const GET_CHATBOT_BY_ID = gql`
  query GetChatbotById($id: Int!) {
    chatbots(id: $id) {
      id
      name
      created_at
      chatbot_characteristics {
        id
        content
        created_at
      }
      chat_sessions {
        id
        created_at
        guest_id
        messages {
          id
          content
          created_at
        }
      }
    }
  }
`;

export const GET_USER_CHATBOTS = gql`
  query GetUSerChatBots {
    chatbotsList {
      name
      id
      created_at
      clerk_user_id
      chatbot_characteristics {
        id
        content
        created_at
      }
      chat_sessions {
        id
        chatbot_id
        created_at
        guest_id
        messages {
          id
          content
          created_at
        }
        guests {
          email
          id
          created_at
          name
        }
      }
    }
  }
`;

export const GET_CHATBOTS_BY_USER = gql`
  query GetChatbotsByUser($clerk_user_id: String!) {
    chatbotsByUser(clerk_user_id: $clerk_user_id) {
      name
      id
      created_at
      chatbot_characteristics {
        id
        content
        created_at
      }
      chat_sessions {
        chatbot_id
        created_at
        guest_id
        messages {
          id
          content
          created_at
        }
      }
    }
  }
`;

export const GET_CHAT_SESSION_MESSAGES = gql`
  query GetChatSessionMessages($id: Int!) {
    chat_sessions(id: $id) {
      id
      created_at
      messages {
        id
        created_at
        sender
        content
      }
      chatbots {
        name
      }
      guests {
        email
        id
        name
      }
    }
  }
`;
