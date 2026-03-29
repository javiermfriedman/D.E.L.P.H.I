from unittest.mock import patch, MagicMock
import pytest
from app.server import add_new_word


@pytest.fixture
def mock_words_response():
    resp = MagicMock()
    resp.data = [{"id": 42}]
    return resp


@pytest.fixture
def mock_upcoming_response():
    return MagicMock()


class TestAddNewWord:
    @patch("app.server.add_word_to_upcoming")
    @patch("app.server.add_word_to_words")
    def test_success(self, mock_add_words, mock_add_upcoming, mock_words_response, mock_upcoming_response):
        mock_add_words.return_value = mock_words_response
        mock_add_upcoming.return_value = mock_upcoming_response

        result = add_new_word("ephemeral", "lasting a short time", "adjective")

        mock_add_words.assert_called_once_with("ephemeral", "lasting a short time", "adjective")
        mock_add_upcoming.assert_called_once_with(42)
        assert result.message == "Word added successfully"

    @patch("app.server.add_word_to_upcoming")
    @patch("app.server.add_word_to_words")
    def test_add_word_to_words_fails(self, mock_add_words, mock_add_upcoming):
        mock_add_words.side_effect = RuntimeError("Failed to insert word")

        with pytest.raises(RuntimeError, match="Failed to insert word"):
            add_new_word("ephemeral", "lasting a short time", "adjective")

        mock_add_upcoming.assert_not_called()

    @patch("app.server.add_word_to_upcoming")
    @patch("app.server.add_word_to_words")
    def test_add_word_to_upcoming_fails(self, mock_add_words, mock_add_upcoming, mock_words_response):
        mock_add_words.return_value = mock_words_response
        mock_add_upcoming.side_effect = RuntimeError("Failed to insert into upcoming")

        with pytest.raises(RuntimeError, match="Failed to insert into upcoming"):
            add_new_word("ephemeral", "lasting a short time", "adjective")

        mock_add_words.assert_called_once_with("ephemeral", "lasting a short time", "adjective")
