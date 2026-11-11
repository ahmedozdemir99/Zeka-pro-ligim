import React, { useState } from 'react';
import { Plus, Upload, Edit, Trash2, Users, Calendar, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { StudentClass } from '../types';
import { sound } from '../utils/sound';

interface ClassesSectionProps {
  classes: StudentClass[];
  onAddClass: (grade: string, branch: string) => void;
  onAddStudent: (classId: string, names: string[]) => void;
  onEditStudents: (classId: string, names: string[]) => void;
  onDeleteClass: (classId: string) => void;
  onMakeFixture: (classId: string) => void;
}

export const ClassesSection: React.FC<ClassesSectionProps> = ({
  classes,
  onAddClass,
  onAddStudent,
  onEditStudents,
  onDeleteClass,
  onMakeFixture,
}) => {
  const [grade, setGrade] = useState<string>('5');
  const [branch, setBranch] = useState<string>('A');
  const [bulkText, setBulkText] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [editingClass, setEditingClass] = useState<StudentClass | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const handleCreateClass = () => {
    sound.playClick();
    onAddClass(grade, branch.trim().toUpperCase() || 'A');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (classes.length === 0) {
      alert('Lütfen önce en az bir sınıf ekleyin.');
      return;
    }

    const targetClassId = selectedClassId || classes[classes.length - 1].id;
    const reader = new FileReader();

    if (/\.txt$|\.csv$/i.test(file.name)) {
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        const names = text
          .split(/\r?\n|,/)
          .map(x => x.trim())
          .filter(Boolean);
        if (names.length > 0) {
          onAddStudent(targetClassId, names);
          sound.playSuccess();
          alert(`${names.length} öğrenci sınıfa aktarıldı.`);
        }
      };
      reader.readAsText(file);
    } else {
      reader.onload = (evt) => {
        try {
          const wb = XLSX.read(evt.target?.result, { type: 'array' });
          const sheet = wb.Sheets[wb.SheetNames[0]];
          const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const names: string[] = [];

          rows.forEach(row => {
            if (row && row[0] !== undefined) {
              const n = String(row[0]).trim();
              if (n && n.toLowerCase() !== 'ad soyad' && n.toLowerCase() !== 'öğrenci') {
                names.push(n);
              }
            }
          });

          if (names.length > 0) {
            onAddStudent(targetClassId, names);
            sound.playSuccess();
            alert(`${names.length} öğrenci Excel dosyasından aktarıldı.`);
          }
        } catch {
          alert('Excel dosyası okunamadı. Lütfen standart formatta bir dosya seçin.');
        }
      };
      reader.readAsArrayBuffer(file);
    }
    e.target.value = '';
  };

  const handleBulkPaste = () => {
    if (!bulkText.trim()) {
      alert('Lütfen yapıştırılacak öğrenci isimlerini yazın.');
      return;
    }
    if (classes.length === 0) {
      alert('Lütfen önce bir sınıf ekleyin.');
      return;
    }

    const targetClassId = selectedClassId || classes[classes.length - 1].id;
    const names = bulkText
      .split(/\r?\n|,/)
      .map(x => x.trim())
      .filter(Boolean);

    if (names.length > 0) {
      onAddStudent(targetClassId, names);
      setBulkText('');
      sound.playSuccess();
      alert(`${names.length} öğrenci başarıyla eklendi.`);
    }
  };

  const handleSingleStudentAdd = (classId: string) => {
    const val = prompt('Öğrenci adı soyadı (birden fazla ise virgül ile ayırın):');
    if (!val) return;
    const names = val.split(/\r?\n|,/).map(x => x.trim()).filter(Boolean);
    if (names.length > 0) {
      onAddStudent(classId, names);
      sound.playSuccess();
    }
  };

  const startEditing = (c: StudentClass) => {
    setEditingClass(c);
    setEditingText(c.students.join('\n'));
  };

  const saveEditing = () => {
    if (!editingClass) return;
    const names = editingText
      .split(/\r?\n|,/)
      .map(x => x.trim())
      .filter(Boolean);
    onEditStudents(editingClass.id, names);
    setEditingClass(null);
    sound.playSuccess();
  };

  return (
    <div className="space-y-4">
      {/* Title Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" /> Sınıflarım
        </h2>
        <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 font-extrabold text-xs border border-purple-500/30">
          {classes.length} Sınıf
        </span>
      </div>

      {/* Add New Class Form */}
      <div className="bg-[#171f42] border border-white/10 rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-extrabold text-white">Yeni Sınıf Oluştur</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Seviye</label>
            <select
              value={grade}
              onChange={e => setGrade(e.target.value)}
              className="w-full bg-[#0e1530] border border-white/10 text-white text-sm rounded-xl p-2.5 outline-none focus:border-purple-500"
            >
              <option value="5">5. Sınıf</option>
              <option value="6">6. Sınıf</option>
              <option value="7">7. Sınıf</option>
              <option value="8">8. Sınıf</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Şube</label>
            <input
              type="text"
              value={branch}
              maxLength={2}
              onChange={e => setBranch(e.target.value)}
              className="w-full bg-[#0e1530] border border-white/10 text-white text-sm rounded-xl p-2.5 outline-none focus:border-purple-500 uppercase font-bold"
              placeholder="A"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleCreateClass}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> Sınıf Ekle
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Import Form */}
      <div className="bg-[#171f42] border border-white/10 rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Upload className="w-4 h-4 text-cyan-400" /> Öğrenci Aktarma Merkezi
        </h3>
        <p className="text-xs text-slate-400">
          Excel (.xlsx), CSV veya TXT dosyalarından otomatik öğrenci listesi aktarabilir veya aşağıya yapıştırabilirsiniz.
        </p>

        {classes.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Hedef Sınıf</label>
            <select
              value={selectedClassId || (classes[classes.length - 1]?.id ?? '')}
              onChange={e => setSelectedClassId(e.target.value)}
              className="w-full bg-[#0e1530] border border-white/10 text-white text-sm rounded-xl p-2.5 outline-none focus:border-purple-500"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.students.length} öğrenci)
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30 hover:bg-cyan-500/30 transition-all">
            <FileText className="w-4 h-4" /> Dosyadan Yükle (.xlsx, .csv, .txt)
            <input type="file" accept=".xlsx,.xls,.csv,.txt" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <div className="space-y-1 pt-2">
          <label className="block text-xs font-semibold text-slate-400">Toplu İsim Yapıştır (Her satıra bir öğrenci)</label>
          <textarea
            value={bulkText}
            onChange={e => setBulkText(e.target.value)}
            rows={4}
            placeholder={`Ahmet Yılmaz\nAyşe Demir\nMehmet Kaya\nZeynep Çelik`}
            className="w-full bg-[#0e1530] border border-white/10 text-white text-sm rounded-xl p-3 outline-none focus:border-purple-500 font-mono text-xs"
          />
          <button
            onClick={handleBulkPaste}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-md hover:brightness-110 transition-all"
          >
            👥 Yapıştırılan Öğrencileri Sınıfa Ekle
          </button>
        </div>
      </div>

      {/* Class List */}
      <div className="space-y-3">
        {classes.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-slate-400 space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm">Henüz sınıf eklenmedi. Yukarıdaki form ile ilk sınıfınızı oluşturun.</p>
          </div>
        ) : (
          classes.map(c => (
            <div key={c.id} className="bg-[#171f42] border border-white/10 rounded-2xl p-4 space-y-3 hover:border-purple-500/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-black text-sm">
                    {c.grade}
                  </span>
                  <b className="text-base font-extrabold text-white">🏫 {c.name}</b>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white/5 text-cyan-300 font-bold text-xs border border-white/10">
                  {c.students.length} öğrenci
                </span>
              </div>

              {/* Student Roster */}
              <div className="bg-[#0e1530] border border-white/5 rounded-xl p-3 max-h-36 overflow-y-auto text-xs text-slate-300 leading-relaxed">
                {c.students.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {c.students.map((student, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg bg-white/5 text-slate-200 font-medium">
                        {student}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 italic">Bu sınıfta henüz öğrenci yok.</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => handleSingleStudentAdd(c.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-green-400" /> Öğrenci Ekle
                </button>
                <button
                  onClick={() => startEditing(c)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5 text-cyan-400" /> Düzenle
                </button>
                <button
                  onClick={() => onMakeFixture(c.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-yellow-400" /> Fikstür Oluştur
                </button>
                <button
                  onClick={() => {
                    if (confirm(`${c.name} sınıfı ve öğrencileri silinsin mi?`)) {
                      onDeleteClass(c.id);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs border border-red-500/20 transition-colors ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Student Modal */}
      {editingClass && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171f42] border border-white/10 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white">{editingClass.name} Öğrenci Listesini Düzenle</h3>
            <p className="text-xs text-slate-400">Her satıra bir öğrenci gelecek şekilde ad ve soyadları düzenleyebilirsiniz.</p>
            <textarea
              value={editingText}
              onChange={e => setEditingText(e.target.value)}
              rows={10}
              className="w-full bg-[#0e1530] border border-white/10 text-white text-sm rounded-xl p-3 outline-none focus:border-purple-500 font-mono"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingClass(null)}
                className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 font-bold text-xs hover:bg-white/10 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={saveEditing}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-md hover:brightness-110"
              >
                <CheckCircle2 className="w-4 h-4" /> Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
