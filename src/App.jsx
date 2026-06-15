import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./Login";

function App() {

const token = localStorage.getItem("token");

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};  const role = localStorage.getItem("role");

  const [ticket, setTicket] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    status: "Open",
  });

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("token") !== null
  );

  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setLoggedIn(false);
  };

  const handleChange = (e) => {

    setTicket({
      ...ticket,
      [e.target.name]: e.target.value,
    });

  };

const fetchTickets = async () => {
  try {

    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:8080/tickets",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setTickets(response.data);

  } catch (error) {
    console.log(error);
  }
};

  const createTicket = async () => {

    try {

      await axios.post(
    "http://localhost:8080/tickets",
    ticket,
    config
);

      setTicket({
        title: "",
        description: "",
        category: "",
        priority: "",
        status: "Open",
      });

      setSuccessMessage(
        "✅ Ticket Created Successfully!"
      );

      setTimeout(() => {

        setSuccessMessage("");

      }, 3000);

      fetchTickets();

    } catch {

      alert("Error Creating Ticket");

    }

  };

  const deleteTicket = async (id) => {

    try {

      await axios.delete(
    `http://localhost:8080/tickets/${id}`,
    config
);
      setDeleteMessage(
        "🗑️ Ticket Deleted Successfully!"
      );

      setTimeout(() => {

        setDeleteMessage("");

      }, 3000);

      fetchTickets();

    } catch {

      alert("Delete Failed");

    }

  };

  const updateStatus = async (
    id,
    newStatus
  ) => {

    try {

      const currentTicket =
        tickets.find(
          (t) => t.id === id
        );
await axios.put(
    `http://localhost:8080/tickets/${id}`,
    {
      ...currentTicket,
      status: newStatus
    },
    config
);

      fetchTickets();

    } catch {

      alert("Update Failed");

    }

  };

  useEffect(() => {

    if (
      loggedIn &&
      role === "ADMIN"
    ) {

      fetchTickets();

    }

  }, [loggedIn]);

  const filteredTickets =
    tickets.filter((t) =>
      t.title?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  if (!loggedIn) {

    return (
      <Login
        onLogin={() =>
          setLoggedIn(true)
        }
      />
    );

  }
  
  return (

    <div style={styles.container}>

      {successMessage && (
        <div style={styles.successPopup}>
          {successMessage}
        </div>
      )}

      {deleteMessage && (
        <div style={styles.deletePopup}>
          {deleteMessage}
        </div>
      )}

      <div style={styles.header}>

        <h1 style={styles.title}>
          Customer Support Portal
        </h1>

        <button
          style={styles.logoutBtn}
          onClick={logout}
        >
          Logout
        </button>

      </div>

      {
        role === "CUSTOMER" && (

          <div style={styles.formCard}>

            <h2>Create Ticket</h2>

            <input
              style={styles.input}
              name="title"
              placeholder="Ticket Title"
              value={ticket.title}
              onChange={handleChange}
            />

            <textarea
              style={styles.textarea}
              name="description"
              placeholder="Description"
              value={ticket.description}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="category"
              placeholder="Category"
              value={ticket.category}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="priority"
              placeholder="Priority"
              value={ticket.priority}
              onChange={handleChange}
            />

            <button
              style={styles.createBtn}
              onClick={createTicket}
            >
              Create Ticket
            </button>

          </div>

        )
      }

      {
        role === "ADMIN" && (

          <>

            <input
              style={styles.search}
              placeholder="Search Tickets..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <div style={styles.grid}>

              {
                filteredTickets.map((t) => (

                  <div
                    key={t.id}
                    style={styles.card}
                  >

                    <h2>{t.title}</h2>

                    <p>{t.description}</p>

                    <p>
                      <b>Category:</b> {t.category}
                    </p>

                    <p>
                      <b>Priority:</b> {t.priority}
                    </p>

                    <div
                      style={{
                        marginTop: "15px",
                        marginBottom: "15px"
                      }}
                    >

                      <span
                        style={{
                          padding: "8px 16px",
                          borderRadius: "25px",
                          color: "#fff",
                          fontWeight: "600",
                          background:
                            t.status === "Open"
                              ? "#22c55e"
                              : t.status === "In Progress"
                              ? "#f59e0b"
                              : "#3b82f6"
                        }}
                      >
                        {t.status}
                      </span>

                    </div>

                    <select
                      style={styles.select}
                      value={t.status}
                      onChange={(e) =>
                        updateStatus(
                          t.id,
                          e.target.value
                        )
                      }
                    >
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>

                    <button
                      style={styles.deleteBtn}
                      onClick={() =>
                        deleteTicket(t.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                ))
              }

            </div>

          </>

        )
      }

    </div>

  );

}

const styles = {

  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#0f172a,#1e293b)",
    padding: "40px",
    color: "white",
    fontFamily: "Inter,sans-serif"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px"
  },

  title: {
    fontSize: "40px",
    fontWeight: "700"
  },

  formCard: {
    background: "#1e293b",
    padding: "25px",
    borderRadius: "15px"
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "none"
  },

  textarea: {
    width: "100%",
    height: "120px",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "none"
  },

  createBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "14px 24px",
    borderRadius: "10px",
    cursor: "pointer"
  },

  logoutBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer"
  },

  search: {
    width: "100%",
    padding: "14px",
    marginBottom: "25px",
    borderRadius: "10px",
    border: "none"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(350px,1fr))",
    gap: "20px"
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "15px"
  },

  select: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    marginBottom: "10px"
  },

  deleteBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "10px",
    width: "100%",
    cursor: "pointer"
  },

  successPopup: {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#22c55e",
    color: "white",
    padding: "16px 24px",
    borderRadius: "15px",
    fontWeight: "600",
    zIndex: 1000
  },

  deletePopup: {
    position: "fixed",
    top: "90px",
    right: "20px",
    background: "#ef4444",
    color: "white",
    padding: "16px 24px",
    borderRadius: "15px",
    fontWeight: "600",
    zIndex: 1000
  }

};

export default App;
