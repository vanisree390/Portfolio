import { useEffect, useState } from "react";

function Home() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [editingDescription, setEditingDescription] = useState("");

    const fetchProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:8080/api/projects");
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch projects:", err);
            setError(err.message);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => fetchProjects(), []);

    const addProject = async () => {
        if (!name || !description) return;
        try {
            const res = await fetch("http://localhost:8080/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description }),
            });
            if (!res.ok) throw new Error("Failed to add project");
            setName("");
            setDescription("");
            fetchProjects();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const deleteProject = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/projects/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete project");
            fetchProjects();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const startEditing = (project) => {
        setEditingId(project.id);
        setEditingName(project.name);
        setEditingDescription(project.description);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingName("");
        setEditingDescription("");
    };

    const saveEdit = async (id) => {
        if (!editingName || !editingDescription) return;
        try {
            const res = await fetch(`http://localhost:8080/api/projects/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editingName, description: editingDescription }),
            });
            if (!res.ok) throw new Error("Failed to update project");
            cancelEditing();
            fetchProjects();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>My Projects</h1>

            {/* Add new project */}
            <div style={styles.addContainer}>
                <input
                    type="text"
                    placeholder="Project Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={styles.input}
                />
                <button onClick={addProject} style={styles.addButton}>
                    Add Project
                </button>
            </div>

            {/* Project list */}
            {loading ? (
                <p style={styles.infoText}>Loading projects...</p>
            ) : error ? (
                <p style={{ ...styles.infoText, color: "red" }}>Error: {error}</p>
            ) : projects.length === 0 ? (
                <p style={styles.infoText}>No projects found</p>
            ) : (
                <div style={styles.projectsContainer}>
                    {projects.map((project) => (
                        <div key={project.id} style={styles.projectCard}>
                            {editingId === project.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        style={styles.editInput}
                                    />
                                    <input
                                        type="text"
                                        value={editingDescription}
                                        onChange={(e) => setEditingDescription(e.target.value)}
                                        style={styles.editInput}
                                    />
                                    <button onClick={() => saveEdit(project.id)} style={styles.saveButton}>
                                        Save
                                    </button>
                                    <button onClick={cancelEditing} style={styles.cancelButton}>
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3 style={styles.projectTitle}>{project.name}</h3>
                                    <p style={styles.projectDesc}>{project.description}</p>
                                    <div style={styles.buttonGroup}>
                                        <button onClick={() => startEditing(project)} style={styles.editButton}>
                                            Edit
                                        </button>
                                        <button onClick={() => deleteProject(project.id)} style={styles.deleteButton}>
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: 800,
        margin: "0 auto",
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
        textAlign: "center",
        color: "#333",
        marginBottom: 30,
    },
    addContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 30,
        justifyContent: "center",
    },
    input: {
        flex: "1 1 200px",
        padding: 10,
        borderRadius: 5,
        border: "1px solid #ccc",
        fontSize: 16,
    },
    addButton: {
        padding: "10px 20px",
        border: "none",
        borderRadius: 5,
        backgroundColor: "#4CAF50",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
    },
    infoText: {
        textAlign: "center",
        fontSize: 18,
        color: "#555",
    },
    projectsContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 20,
    },
    projectCard: {
        backgroundColor: "#f9f9f9",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        position: "relative",
    },
    projectTitle: {
        margin: 0,
        color: "#333",
    },
    projectDesc: {
        color: "#666",
        marginTop: 5,
    },
    buttonGroup: {
        marginTop: 10,
        display: "flex",
        gap: 10,
    },
    editButton: {
        padding: "5px 10px",
        border: "none",
        borderRadius: 5,
        backgroundColor: "#2196F3",
        color: "white",
        cursor: "pointer",
    },
    deleteButton: {
        padding: "5px 10px",
        border: "none",
        borderRadius: 5,
        backgroundColor: "#f44336",
        color: "white",
        cursor: "pointer",
    },
    editInput: {
        width: "100%",
        padding: 8,
        marginBottom: 5,
        borderRadius: 5,
        border: "1px solid #ccc",
        fontSize: 15,
    },
    saveButton: {
        padding: "5px 10px",
        marginRight: 5,
        border: "none",
        borderRadius: 5,
        backgroundColor: "#4CAF50",
        color: "white",
        cursor: "pointer",
    },
    cancelButton: {
        padding: "5px 10px",
        border: "none",
        borderRadius: 5,
        backgroundColor: "#999",
        color: "white",
        cursor: "pointer",
    },
};

export default Home;