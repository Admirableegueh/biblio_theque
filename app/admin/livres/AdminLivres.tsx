"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

interface Livre {
  id: number;
  titre: string;
  auteur: string;
  genre: string;
  annee_publication?: number;
  quantite?: number;
  imageUrl?: string;
}

export default function AdminLivres() {
  const { token } = useAuth();
  const [livres, setLivres] = useState<Livre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState<Partial<Livre>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!token) return;
    axios.get("http://localhost:4000/api/livres", {
      headers: { token }
    })
      .then(res => { setLivres(res.data); setLoading(false); })
      .catch(() => { setError("Erreur de chargement des livres"); setLoading(false); });
  }, [token]);

  // Ajout ou modification d'un livre
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccess("");
    if (!form.titre || !form.auteur || !form.genre) {
      setFormError("Titre, auteur et genre obligatoires");
      return;
    }
    setFormLoading(true);
    let imageUrl = form.imageUrl || '';
    // Si un fichier image est sélectionné, on l'upload d'abord
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      try {
        const uploadRes = await axios.post('http://localhost:4000/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data', token },
        });
        imageUrl = uploadRes.data.imageUrl;
      } catch {
        setFormError("Erreur lors de l'upload de l'image");
        setFormLoading(false);
        return;
      }
    }
    try {
      if (editId) {
        await axios.put(`http://localhost:4000/api/livres/${editId}`, { ...form, imageUrl }, { headers: { token } });
        setSuccess("Livre modifié avec succès.");
      } else {
        await axios.post("http://localhost:4000/api/livres", { ...form, imageUrl }, { headers: { token } });
        setSuccess("Livre ajouté avec succès.");
      }
      setForm({});
      setImageFile(null);
      setEditId(null);
      setLoading(true);
      // Recharge la liste
      const res = await axios.get("http://localhost:4000/api/livres", { headers: { token } });
      setLivres(res.data);
      setLoading(false);
    } catch {
      setFormError("Erreur lors de l'enregistrement");
    }
    setFormLoading(false);
    setTimeout(() => { setFormError(""); setSuccess(""); }, 2000);
  };

  // Suppression d'un livre
  const handleDelete = async (id: number) => {
    if (!window.confirm("Supprimer ce livre ?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/livres/${id}`, { headers: { token } });
      setLivres(livres.filter(l => l.id !== id));
      setSuccess("Livre supprimé avec succès.");
      setTimeout(() => setSuccess(""), 2000);
    } catch {
      setError("Erreur lors de la suppression");
      setTimeout(() => setError(""), 2000);
    }
  };

  // Pré-remplir le formulaire pour modification
  const handleEdit = (livre: Livre) => {
    setForm(livre);
    setEditId(livre.id);
  };

  // Annuler modification
  const handleCancel = () => {
    setForm({});
    setEditId(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 bg-green-50 rounded-lg p-6 shadow flex flex-col gap-2">
        <h3 className="text-lg font-bold mb-2 text-green-800">{editId ? "Modifier un livre" : "Ajouter un livre"}</h3>
        <form className="flex flex-col md:flex-row gap-4 items-center" onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full md:w-1/4"
            type="text"
            placeholder="Titre"
            value={form.titre || ''}
            onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
            required
          />
          <input
            className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full md:w-1/4"
            type="text"
            placeholder="Auteur"
            value={form.auteur || ''}
            onChange={e => setForm(f => ({ ...f, auteur: e.target.value }))}
            required
          />
          <input
            className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full md:w-1/4"
            type="text"
            placeholder="Genre"
            value={form.genre || ''}
            onChange={e => setForm(f => ({ ...f, genre: e.target.value }))}
            required
          />
          <input
            className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full md:w-1/6"
            type="number"
            placeholder="Année"
            value={form.annee_publication === 0 || form.annee_publication === undefined || isNaN(Number(form.annee_publication)) ? '' : form.annee_publication}
            min={0}
            max={3000}
            onChange={e => setForm(f => ({ ...f, annee_publication: e.target.value === '' ? undefined : Number(e.target.value) }))}
          />
          <input
            className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full md:w-1/6"
            type="number"
            placeholder="Quantité"
            value={form.quantite === 0 || form.quantite === undefined || isNaN(Number(form.quantite)) ? '' : form.quantite}
            min={0}
            max={1000}
            onChange={e => setForm(f => ({ ...f, quantite: e.target.value === '' ? undefined : Number(e.target.value) }))}
          />
          <input
            className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full md:w-1/4"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <input
            className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full md:w-1/4"
            type="text"
            placeholder="Image (URL ou chemin)"
            value={form.imageUrl || ''}
            onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
            disabled={!!imageFile}
          />
          <button
            type="submit"
            className={`px-5 py-2 rounded font-semibold shadow transition-all duration-200 ${editId ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
            disabled={formLoading}
          >
            {editId ? "Enregistrer" : "Ajouter"}
          </button>
          {editId && (
            <button type="button" className="ml-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold" onClick={handleCancel} disabled={formLoading}>Annuler</button>
          )}
        </form>
        {formError && <div className="text-red-600 font-semibold mt-2">{formError}</div>}
        {success && <div className="text-green-600 font-semibold mt-2">{success}</div>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border rounded bg-white text-black shadow">
          <thead>
            <tr className="bg-green-100">
              <th className="p-3">Image</th>
              <th className="p-3">Titre</th>
              <th className="p-3">Auteur</th>
              <th className="p-3">Genre</th>
              <th className="p-3">Année</th>
              <th className="p-3">Quantité</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-4">Chargement...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className="text-center text-red-600 py-4">{error}</td></tr>
            ) : livres.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-4">Aucun livre</td></tr>
            ) : (
              livres.map(livre => (
                <tr key={livre.id} className="border-t hover:bg-green-50 transition">
                  <td className="p-3">
                    {livre.imageUrl ? (
                      <img
                        src={livre.imageUrl.startsWith('http') ? livre.imageUrl : `http://localhost:4000${livre.imageUrl}`}
                        alt={livre.titre}
                        className="h-12 w-10 object-cover rounded shadow"
                        onError={e => { (e.target as HTMLImageElement).src = '/file.svg'; }}
                      />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3">{livre.titre}</td>
                  <td className="p-3">{livre.auteur}</td>
                  <td className="p-3">{livre.genre}</td>
                  <td className="p-3">{livre.annee_publication || '-'}</td>
                  <td className="p-3">{livre.quantite ?? '-'}</td>
                  <td className="p-3 flex gap-2">
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded font-semibold transition" onClick={() => handleEdit(livre)}>Modifier</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-semibold transition" onClick={() => handleDelete(livre.id)}>Supprimer</button>
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
