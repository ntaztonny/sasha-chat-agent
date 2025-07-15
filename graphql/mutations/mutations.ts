import { gql } from "@apollo/client";

export const CREATE_CHATBOT = gql`
  mutation CreateChatbot(
    $clerk_user_id: String!
    $created_at: DateTime!
    $name: String!
  ) {
    insertChatbots(
      clerk_user_id: $clerk_user_id
      created_at: $created_at
      name: $name
    ) {
      id
      name
    }
  }
`;

export const REMOVE_CHARACTERISTIC = gql`
  mutation RemoveCharacteristic($characteristicId: Int!) {
    deleteChatbot_characteristics(id: $characteristicId) {
      id
    }
  }
`;

export const DELETE_CHATBOT = gql`
  mutation DeleteChatBot($id: Int!) {
    deleteChatbots(id: $id) {
      id
    }
  }
`;

export const ADD_CHARACTERISTIC = gql`
  mutation AddCharacteristic(
    $chatbotId: Int!
    $content: String!
    $created_at: DateTime!
  ) {
    insertChatbot_characteristics(
      chatbot_id: $chatbotId
      content: $content
      created_at: $created_at
    ) {
      chatbot_id: chatbot_id
      content: content
    }
  }
`;

export const UPDATE_CHATBOT = gql`
  mutation UpdateChatbot($id: Int!, $name: String!) {
    updateChatbots(id: $id, name: $name) {
      id: id
      name: name
    }
  }
`;

export const INSERT_MESSAGE = gql`
  mutation InsertMessage($chat_session_id: !Int, $content: !String, $created_at: !DateTime, $sender: !String) {
    insertMessages(chat_session_id: $chat_session_id, content: $content, created_at: $created_at, sender: $sender) {
    content
    created_at
    id
    sender
    chat_session_id
		# chat_sessions {
    #   chatbot_id
    #   created_at
    #   guest_id
    #   id
    # }
  }
  }
`;

export const INSERT_GUEST = gql`
  mutation insertGuest(
    $name: String!
    $email: String!
    $created_at: DateTime!
  ) {
    insertGuests(name: $name, email: $email, created_at: $created_at) {
      id
    }
  }
`;
