from unittest.mock import patch, MagicMock
from app.services.llm import check_word_already_used


@patch("app.services.llm.get_word_id_by_word")
def test_word_already_used(mock_get_word):
    mock_get_word.return_value = MagicMock(data=[{"id": 1}])

    result = check_word_already_used.invoke("ephemeral")

    assert result == "ephemeral has already been used"
    mock_get_word.assert_called_once_with("ephemeral")


@patch("app.services.llm.get_word_id_by_word")
def test_word_not_used(mock_get_word):
    mock_get_word.return_value = MagicMock(data=[])

    result = check_word_already_used.invoke("ephemeral")

    assert result == "ephemeral has not been used"
    mock_get_word.assert_called_once_with("ephemeral")
