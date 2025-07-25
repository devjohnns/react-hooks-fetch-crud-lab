
import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  function handleAddQuestion(newQuestionData) {
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestionData),
    })
      .then((res) => res.json())
      .then((newQuestion) => {
        setQuestions((prev) => [...prev, newQuestion]);
      });
  }

  function handleDeleteQuestion(deletedId) {
    fetch(`http://localhost:4000/questions/${deletedId}`, {
      method: "DELETE",
    }).then(() => {
      setQuestions((prev) => prev.filter((q) => q.id !== deletedId));
    });
  }

  function handleUpdateQuestion(updatedQuestion) {
    fetch(`http://localhost:4000/questions/${updatedQuestion.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex: updatedQuestion.correctIndex }),
    })
      .then((res) => res.json())
      .then((data) => {
        setQuestions((prev) =>
          prev.map((q) => (q.id === data.id ? data : q))
        );
      });
  }

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onAddQuestion={handleAddQuestion} />
      ) : (
        <QuestionList
          questions={questions}
          onDelete={handleDeleteQuestion}
          onUpdate={handleUpdateQuestion}
        />
      )}
    </main>
  );
}

export default App;