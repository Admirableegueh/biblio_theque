"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

export default function AdminEtudiants() {
  const { token } = useAuth();
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState<{ nom: string; prenom: string; email: string; id?: number }>(
    { nom: "", prenom: "", email: "" }
  );
  const [editId, setEditId] = useState<number | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:4000/api/admin/utilisateurs", {
        headers: { token }
      })
      .then(res => { setEtudiants(res.data); setLoading(false); })
      .catch(() => { setError("Erreur de chargement des étudiants"); setLoading(false); });
  }, [token]);

  // Suppression d'un étudiant
  const handleDelete = async (id: number) => {
    if (!window.confirm("Supprimer cet étudiant ?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/admin/utilisateurs/${id}`, { headers: { token } });
      setEtudiants(etudiants.filter(e => e.id !== id));
      setSuccess("Étudiant supprimé avec succès.");
      setTimeout(() => setSuccess(""), 2000);
    } catch {
      setError("Erreur lors de la suppression");
      setTimeout(() => setError(""), 2000);
    }
  };

  // Ajout ou modification d'un étudiant
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setSuccess("");
    try {
      if (editId) {
        // Modification
        await axios.put(`http://localhost:4000/api/admin/utilisateurs/${editId}`, form, { headers: { token } });
        setEtudiants(etudiants.map(e => e.id === editId ? { ...e, ...form, id: editId } : e));
        setSuccess("Étudiant modifié avec succès.");
      } else {
        // Ajout
        const res = await axios.post("http://localhost:4000/api/admin/utilisateurs", form, { headers: { token } });
        setEtudiants([...etudiants, res.data]);
        setSuccess("Étudiant ajouté avec succès.");
      }
      setForm({ nom: "", prenom: "", email: "" });
      setEditId(null);
    } catch {
      setError("Erreur lors de l'enregistrement");
    }
    setFormLoading(false);
    setTimeout(() => { setError(""); setSuccess(""); }, 2000);
  };

  // Pré-remplir le formulaire pour modification
  const handleEdit = (etudiant: Etudiant) => {
    setForm({ nom: etudiant.nom, prenom: etudiant.prenom, email: etudiant.email });
    setEditId(etudiant.id);
  };

  // Annuler modification
  const handleCancel = () => {
    setForm({ nom: "", prenom: "", email: "" });
    setEditId(null);
  };

  return (
    <div className="w-full">
      <div className="mb-8 bg-blue-50 rounded-lg p-6 shadow flex flex-col gap-2">
        <h3 className="text-lg font-bold mb-2 text-blue-800">{editId ? "Modifier un étudiant" : "Ajouter un étudiant"}</h3>
        <form className="flex flex-col md:flex-row gap-4 items-center" onSubmit={handleSubmit}>
          <input
            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full md:w-1/4"
            type="text"
            placeholder="Nom"
            value={form.nom}
            onChange={e => setForm({ ...form, nom: e.target.value })}
            required
          />
          <input
            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full md:w-1/4"
            type="text"
            placeholder="Prénom"
            value={form.prenom}
            onChange={e => setForm({ ...form, prenom: e.target.value })}
            required
          />
          <input
            className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full md:w-1/3"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <button
            type="submit"
            className={`px-5 py-2 rounded font-semibold shadow transition-all duration-200 ${editId ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            disabled={formLoading}
          >
            {editId ? "Enregistrer" : "Ajouter"}
          </button>
          {editId && (
            <button type="button" className="ml-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold" onClick={handleCancel} disabled={formLoading}>Annuler</button>
          )}
        </form>
        {error && <div className="text-red-600 font-semibold mt-2">{error}</div>}
        {success && <div className="text-green-600 font-semibold mt-2">{success}</div>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border rounded bg-white text-black shadow">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-3">Nom</th>
              <th className="p-3">Prénom</th>
              <th className="p-3">Email</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-4">Chargement...</td></tr>
            ) : error ? (
              <tr><td colSpan={4} className="text-center text-red-600 py-4">{error}</td></tr>
            ) : etudiants.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-4">Aucun étudiant</td></tr>
            ) : (
              etudiants.map(e => (
                <tr key={e.id} className="border-t hover:bg-blue-50 transition">
                  <td className="p-3">{e.nom}</td>
                  <td className="p-3">{e.prenom}</td>
                  <td className="p-3">{e.email}</td>
                  <td className="p-3 flex gap-2">
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded font-semibold transition" onClick={() => handleEdit(e)}>Modifier</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-semibold transition" onClick={() => handleDelete(e.id)}>Supprimer</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
