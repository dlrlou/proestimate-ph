import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Calculator,
  FileSpreadsheet,
  Database,
  FileCheck2,
  Plus,
  Trash2,
  Download,
  Printer,
  ArrowRight,
  Building2,
  Layers,
  Hammer,
  Grid,
  CheckCircle2,
  Sliders,
  RefreshCw,
  Info,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  FolderKanban,
  Copy,
  Upload,
  Save,
  Check,
  Briefcase,
  MapPin,
  User,
  RotateCcw,
  FileJson,
  ChevronRight
} from 'lucide-react';

// ==========================================
// INITIAL PHILIPPINE UNIT PRICE DATABASE (PHP)
// ==========================================
const INITIAL_UNIT_DB = [
  { id: 'MAT-CEM-40', code: 'MAT-001', name: 'Portland Cement (40kg Bag)', category: 'Concrete & Masonry', unit: 'bags', materialCost: 245, laborCost: 85 },
  { id: 'MAT-SAND', code: 'MAT-002', name: 'Washed River Sand (S1)', category: 'Concrete & Masonry', unit: 'cu.m', materialCost: 1450, laborCost: 450 },
  { id: 'MAT-GRAVEL', code: 'MAT-003', name: 'Crushed Gravel 3/4" (G1)', category: 'Concrete & Masonry', unit: 'cu.m', materialCost: 1650, laborCost: 500 },
  { id: 'MAT-CHB-4', code: 'MAT-004', name: 'CHB 4" (100mm x 200mm x 400mm)', category: 'Concrete & Masonry', unit: 'pcs', materialCost: 16, laborCost: 12 },
  { id: 'MAT-CHB-5', code: 'MAT-005', name: 'CHB 5" (125mm x 200mm x 400mm)', category: 'Concrete & Masonry', unit: 'pcs', materialCost: 19, laborCost: 14 },
  { id: 'MAT-CHB-6', code: 'MAT-006', name: 'CHB 6" (150mm x 200mm x 400mm)', category: 'Concrete & Masonry', unit: 'pcs', materialCost: 23, laborCost: 16 },
  { id: 'MAT-RSB-10', code: 'MAT-007', name: 'Deformed Rebar 10mmØ Grade 40', category: 'Rebar & Steel', unit: 'kg', materialCost: 48, laborCost: 18 },
  { id: 'MAT-RSB-12', code: 'MAT-008', name: 'Deformed Rebar 12mmØ Grade 40', category: 'Rebar & Steel', unit: 'kg', materialCost: 47, laborCost: 17 },
  { id: 'MAT-RSB-16', code: 'MAT-009', name: 'Deformed Rebar 16mmØ Grade 60', category: 'Rebar & Steel', unit: 'kg', materialCost: 49, laborCost: 16 },
  { id: 'MAT-RSB-20', code: 'MAT-010', name: 'Deformed Rebar 20mmØ Grade 60', category: 'Rebar & Steel', unit: 'kg', materialCost: 50, laborCost: 16 },
  { id: 'MAT-RSB-25', code: 'MAT-011', name: 'Deformed Rebar 25mmØ Grade 60', category: 'Rebar & Steel', unit: 'kg', materialCost: 51, laborCost: 16 },
  { id: 'MAT-GI-16', code: 'MAT-012', name: '#16 G.I. Tie Wire', category: 'Rebar & Steel', unit: 'kg', materialCost: 88, laborCost: 25 },
  { id: 'MAT-PLY-12', code: 'MAT-013', name: 'Phenolic / Marine Plywood 1/2" (4x8)', category: 'Formworks', unit: 'pcs', materialCost: 920, laborCost: 320 },
  { id: 'MAT-LUMBER', code: 'MAT-014', name: 'Coco / Good Lumber Scaffolding', category: 'Formworks', unit: 'bd.ft', materialCost: 46, laborCost: 18 },
  { id: 'LAB-EXCAV', code: 'WRK-001', name: 'Structural Excavation (Manual/Backhoe)', category: 'Earthworks', unit: 'cu.m', materialCost: 0, laborCost: 480 },
  { id: 'LAB-GRAVELBED', code: 'WRK-002', name: 'Gravel Bedding G1 (100mm thk)', category: 'Earthworks', unit: 'cu.m', materialCost: 1650, laborCost: 520 },
];

const DIVISIONS = [
  '1000 General Requirements',
  '2000 Earthworks',
  '3000 Concrete Works',
  '4000 Masonry Works',
  '5000 Rebar & Structural Steel',
  '6000 Architectural Finishes',
  '7000 MEPFS (Electrical & Plumbing)'
];

const PROJECT_STATUSES = [
  'Draft Estimate',
  'Bid Submitted',
  'Awarded / Ongoing',
  'Completed',
  'Archived'
];

// ==========================================
// PRE-LOADED 3 REALISTIC PHILIPPINE PROJECTS
// ==========================================
const DEFAULT_PROJECTS = [
  {
    id: 'proj-qc-duplex',
    projectTitle: '2-Storey Modern Residential Duplex - Quezon City',
    clientName: 'Spouses Marco & Elena Villanueva',
    location: 'Teachers Village East, Diliman, Quezon City',
    status: 'Awarded / Ongoing',
    contractorName: 'VANGUARD BUILDERS & ENGINEERING SERVICES',
    pcabLicense: 'PCAB Lic. No. 48291 (Category B - General Building)',
    preparedBy: 'Engr. Juan Dela Cruz, RCE',
    prcNumber: 'PRC Reg. No. 0148920 | PTR No. 8849201',
    date: '2026-10-15',
    validityDays: 30,
    mtoHistory: [
      {
        id: 101,
        type: 'Concrete Works',
        title: 'Footing F1 & Columns C1 (Class A)',
        summary: '16.20 cu.m | 146 bags Cement, 8.1 cu.m Sand, 16.2 cu.m Gravel',
        cost: 89420
      }
    ],
    boqItems: [
      {
        id: 'qc-1',
        itemNo: '1001.1',
        description: 'Mobilization, Temporary Bodega, Barracks & Building Permit Processing',
        division: '1000 General Requirements',
        unit: 'lot',
        qty: 1,
        materialUnitCost: 45000,
        laborUnitCost: 35000,
        ocmPct: 10,
        profitPct: 10,
        vatPct: 12,
      },
      {
        id: 'qc-2',
        itemNo: '1002.1',
        description: 'DOLE OSH Safety Program (PPE, First Aid, Perimeter Netting & Signage)',
        division: '1000 General Requirements',
        unit: 'lot',
        qty: 1,
        materialUnitCost: 22000,
        laborUnitCost: 12000,
        ocmPct: 10,
        profitPct: 10,
        vatPct: 12,
      },
      {
        id: 'qc-3',
        itemNo: '2001.1',
        description: 'Structural Excavation for Isolated Footings F1/F2 & Wall Footings',
        division: '2000 Earthworks',
        unit: 'cu.m',
        qty: 68.5,
        materialUnitCost: 0,
        laborUnitCost: 480,
        ocmPct: 12,
        profitPct: 10,
        vatPct: 12,
      },
      {
        id: 'qc-4',
        itemNo: '2002.1',
        description: 'Compacted G1 Gravel Bedding (100mm thk under Footings & Slab on Fill)',
        division: '2000 Earthworks',
        unit: 'cu.m',
        qty: 14.0,
        materialUnitCost: 1650,
        laborUnitCost: 520,
        ocmPct: 12,
        profitPct: 10,
        vatPct: 12,
      },
      {
        id: 'qc-5',
        itemNo: '3001.1',
        description: 'Portland Cement 40kg (Footings, Columns, 2F Suspended Beams & Slab - Class A)',
        division: '3000 Concrete Works',
        unit: 'bags',
        qty: 640,
        materialUnitCost: 245,
        laborUnitCost: 85,
        ocmPct: 12,
        profitPct: 10,
        vatPct: 12,
      },
      {
        id: 'qc-6',
        itemNo: '3001.2',
        description: 'Washed River Sand S1 & Crushed Gravel 3/4" Package (Structural Concrete)',
        division: '3000 Concrete Works',
        unit: 'cu.m',
        qty: 96,
        materialUnitCost: 1580,
        laborUnitCost: 480,
        ocmPct: 12,
        profitPct: 10,
        vatPct: 12,
      },
      {
        id: 'qc-7',
        itemNo: '4001.1',
        description: '6" Exterior Firewall & Perimeter CHB Masonry with 2-Face Plastering',
        division: '4000 Masonry Works',
        unit: 'pcs',
        qty: 3850,
        materialUnitCost: 23,
        laborUnitCost: 16,
        ocmPct: 12,
        profitPct: 10,
        vatPct: 12,
      },
      {
        id: 'qc-8',
        itemNo: '5001.1',
        description: 'Deformed Reinforcing Steel Bars 16mmØ & 12mmØ Grade 60/40 + #16 GI Tie Wire',
        division: '5000 Rebar & Structural Steel',
        unit: 'kg',
        qty: 6450,
        materialUnitCost: 49,
        laborUnitCost: 17,
        ocmPct: 12,
        profitPct: 10,
        vatPct: 12,
      },
      {
        id: 'qc-9',
        itemNo: '6001.1',
        description: '600x600mm Homogeneous Floor Tiles, Skimcoat, Painting & Phenolic Formworks',
        division: '6000 Architectural Finishes',
        unit: 'sq.m',
        qty: 210,
        materialUnitCost: 1450,
        laborUnitCost: 680,
        ocmPct: 12,
        profitPct: 10,
        vatPct: 12,
      },
      {
        id: 'qc-10',
        itemNo: '7001.1',
        description: 'Complete Rough-In & Fixture Installation (PPR Waterline, uPVC Sanitary, Panelboard)',
        division: '7000 MEPFS (Electrical & Plumbing)',
        unit: 'lot',
        qty: 1,
        materialUnitCost: 245000,
        laborUnitCost: 115000,
        ocmPct: 12,
        profitPct: 10,
        vatPct: 12,
      }
    ]
  },
  {
    id: 'proj-dpwh-road',
    projectTitle: 'DPWH Barangay Farm-to-Market Road Concreting',
    clientName: 'DPWH Regional Office IV-A / LGU Tanay',
    location: 'Brgy. Sampaloc, Tanay, Rizal (Sta. 0+000 to Sta. 0+450)',
    status: 'Bid Submitted',
    contractorName: 'VANGUARD BUILDERS & ENGINEERING SERVICES',
    pcabLicense: 'PCAB Lic. No. 48291 (Category B - General Engineering)',
    preparedBy: 'Engr. Juan Dela Cruz, RCE',
    prcNumber: 'PRC Reg. No. 0148920 | PTR No. 8849201',
    date: '2026-10-24',
    validityDays: 60,
    mtoHistory: [],
    boqItems: [
      {
        id: 'rd-1',
        itemNo: 'B.5',
        description: 'Project Billboard / COA & DPWH Standard Tarpaulin Signage (8ft x 8ft)',
        division: '1000 General Requirements',
        unit: 'each',
        qty: 2,
        materialUnitCost: 6500,
        laborUnitCost: 2500,
        ocmPct: 12,
        profitPct: 8,
        vatPct: 12,
      },
      {
        id: 'rd-2',
        itemNo: 'B.7(2)',
        description: 'Occupational Safety and Health Program (Construction Safety & Traffic Management)',
        division: '1000 General Requirements',
        unit: 'l.s.',
        qty: 1,
        materialUnitCost: 48000,
        laborUnitCost: 32000,
        ocmPct: 0,
        profitPct: 8,
        vatPct: 12,
      },
      {
        id: 'rd-3',
        itemNo: '102(2)',
        description: 'Surplus Common Excavation & Roadway Subgrade Preparation',
        division: '2000 Earthworks',
        unit: 'cu.m',
        qty: 820,
        materialUnitCost: 0,
        laborUnitCost: 340,
        ocmPct: 15,
        profitPct: 8,
        vatPct: 12,
      },
      {
        id: 'rd-4',
        itemNo: '200(1)',
        description: 'Aggregate Subbase Course (200mm thk Compacted Base Course)',
        division: '2000 Earthworks',
        unit: 'cu.m',
        qty: 495,
        materialUnitCost: 1150,
        laborUnitCost: 390,
        ocmPct: 15,
        profitPct: 8,
        vatPct: 12,
      },
      {
        id: 'rd-5',
        itemNo: '311(1)b1',
        description: 'Portland Cement Concrete Pavement (PCCP - 230mm thk, 3500 psi @ 14 days)',
        division: '3000 Concrete Works',
        unit: 'sq.m',
        qty: 2250,
        materialUnitCost: 1480,
        laborUnitCost: 420,
        ocmPct: 15,
        profitPct: 8,
        vatPct: 12,
      },
      {
        id: 'rd-6',
        itemNo: '500(1)',
        description: 'RCPC Cross Drainage Culvert & Stone Masonry Slope Protection Riprap',
        division: '4000 Masonry Works',
        unit: 'cu.m',
        qty: 185,
        materialUnitCost: 2650,
        laborUnitCost: 950,
        ocmPct: 15,
        profitPct: 8,
        vatPct: 12,
      }
    ]
  },
  {
    id: 'proj-laguna-warehouse',
    projectTitle: 'Commercial Warehouse Fit-Out & Mezzanine - Laguna',
    clientName: 'Pacific ColdChain Logistics Corp.',
    location: 'Light Industry & Science Park, Cabuyao, Laguna',
    status: 'Draft Estimate',
    contractorName: 'VANGUARD BUILDERS & ENGINEERING SERVICES',
    pcabLicense: 'PCAB Lic. No. 48291 (Category B - General Building)',
    preparedBy: 'Engr. Juan Dela Cruz, RCE',
    prcNumber: 'PRC Reg. No. 0148920 | PTR No. 8849201',
    date: '2026-10-29',
    validityDays: 30,
    mtoHistory: [],
    boqItems: [
      {
        id: 'wh-1',
        itemNo: '1001.1',
        description: 'Mobilization, Industrial Park Gate Pass, Safety Officer & Temporary Hoarding',
        division: '1000 General Requirements',
        unit: 'lot',
        qty: 1,
        materialUnitCost: 38000,
        laborUnitCost: 42000,
        ocmPct: 12,
        profitPct: 12,
        vatPct: 12,
      },
      {
        id: 'wh-2',
        itemNo: '3001.1',
        description: 'Reinforced Pedestal Footings & Heavy-Duty Forklift Slab Topping (Class AA)',
        division: '3000 Concrete Works',
        unit: 'cu.m',
        qty: 48,
        materialUnitCost: 4250,
        laborUnitCost: 1350,
        ocmPct: 12,
        profitPct: 12,
        vatPct: 12,
      },
      {
        id: 'wh-3',
        itemNo: '5001.1',
        description: 'Structural Steel Wide Flange Mezzanine Columns, Beams & Checkered Plate Decking',
        division: '5000 Rebar & Structural Steel',
        unit: 'kg',
        qty: 9200,
        materialUnitCost: 68,
        laborUnitCost: 26,
        ocmPct: 12,
        profitPct: 12,
        vatPct: 12,
      },
      {
        id: 'wh-4',
        itemNo: '6001.1',
        description: 'Industrial Epoxy Floor Coating (3-Coat System) & Drywall Office Partition',
        division: '6000 Architectural Finishes',
        unit: 'sq.m',
        qty: 340,
        materialUnitCost: 850,
        laborUnitCost: 420,
        ocmPct: 12,
        profitPct: 12,
        vatPct: 12,
      },
      {
        id: 'wh-5',
        itemNo: '7001.1',
        description: 'High-Bay LED Industrial Lighting, 3-Phase Sub-Panel & Fire Sprinkler Drop',
        division: '7000 MEPFS (Electrical & Plumbing)',
        unit: 'lot',
        qty: 1,
        materialUnitCost: 185000,
        laborUnitCost: 85000,
        ocmPct: 12,
        profitPct: 12,
        vatPct: 12,
      }
    ]
  }
];

const STORAGE_KEYS = {
  PROJECTS: 'proestimate_ph_projects_v2',
  ACTIVE_ID: 'proestimate_ph_active_id_v2',
  UNIT_DB: 'proestimate_ph_unit_db_v2'
};

// Helper formatter for Philippine Peso
const formatPHP = (num, decimals = 2) => {
  const val = Number(num) || 0;
  return '₱' + val.toLocaleString('en-PH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

// Helper to calculate financial summary for any project's BOQ array
const calculateProjectFinancials = (boqItems = []) => {
  let totalMaterial = 0;
  let totalLabor = 0;
  let totalDirect = 0;
  let totalOcm = 0;
  let totalProfit = 0;
  let totalVat = 0;
  let grandTotal = 0;

  const divisionMap = {};
  DIVISIONS.forEach(d => {
    divisionMap[d] = { direct: 0, bidTotal: 0, count: 0 };
  });

  const computedItems = boqItems.map((item) => {
    const qty = Number(item.qty) || 0;
    const matUnit = Number(item.materialUnitCost) || 0;
    const labUnit = Number(item.laborUnitCost) || 0;
    const directCost = qty * (matUnit + labUnit);

    const ocmFactor = (Number(item.ocmPct) || 0) / 100;
    const profitFactor = (Number(item.profitPct) || 0) / 100;
    const vatFactor = (Number(item.vatPct) || 0) / 100;

    const ocmAmount = directCost * ocmFactor;
    const profitAmount = directCost * profitFactor;
    const preTaxTotal = directCost + ocmAmount + profitAmount;
    const vatAmount = preTaxTotal * vatFactor;
    const totalAmount = preTaxTotal + vatAmount;
    const unitBidPrice = qty > 0 ? totalAmount / qty : 0;

    totalMaterial += qty * matUnit;
    totalLabor += qty * labUnit;
    totalDirect += directCost;
    totalOcm += ocmAmount;
    totalProfit += profitAmount;
    totalVat += vatAmount;
    grandTotal += totalAmount;

    const divKey = item.division || DIVISIONS[0];
    if (!divisionMap[divKey]) {
      divisionMap[divKey] = { direct: 0, bidTotal: 0, count: 0 };
    }
    divisionMap[divKey].direct += directCost;
    divisionMap[divKey].bidTotal += totalAmount;
    divisionMap[divKey].count += 1;

    return {
      ...item,
      directCost,
      ocmAmount,
      profitAmount,
      vatAmount,
      unitBidPrice,
      totalAmount
    };
  });

  return {
    computedItems,
    totalMaterial,
    totalLabor,
    totalDirect,
    totalOcm,
    totalProfit,
    totalVat,
    grandTotal,
    divisionMap
  };
};

const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'Awarded / Ongoing':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 'Bid Submitted':
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    case 'Draft Estimate':
      return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
    case 'Completed':
      return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    default:
      return 'bg-slate-800 text-slate-400 border-slate-700';
  }
};

export default function App() {
  // Navigation Tabs: 'portfolio' | 'mto' | 'boq' | 'db' | 'proposal'
  const [activeTab, setActiveTab] = useState('portfolio');
  const [activeMtoModule, setActiveMtoModule] = useState('concrete'); // 'concrete' | 'masonry' | 'rebar'
  const [toastMessage, setToastMessage] = useState(null);
  const [lastSavedTime, setLastSavedTime] = useState('Just now');
  const fileInputRef = useRef(null);

  // ==========================================
  // PERSISTENT MULTI-PROJECT STATE (localStorage)
  // ==========================================
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load projects from localStorage:', e);
    }
    return DEFAULT_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
      if (savedId) return savedId;
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PROJECTS[0].id;
  });

  const [unitDb, setUnitDb] = useState(() => {
    try {
      const savedDb = localStorage.getItem(STORAGE_KEYS.UNIT_DB);
      if (savedDb) {
        const parsed = JSON.parse(savedDb);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_UNIT_DB;
  });

  // Sync changes to localStorage automatically
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, activeProjectId);
      localStorage.setItem(STORAGE_KEYS.UNIT_DB, JSON.stringify(unitDb));
      const now = new Date();
      setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.error('Auto-save error:', e);
    }
  }, [projects, activeProjectId, unitDb]);

  // Ensure activeProject always resolves to a valid project
  const activeProject = useMemo(() => {
    return projects.find(p => p.id === activeProjectId) || projects[0];
  }, [projects, activeProjectId]);

  // Helper to update properties of the currently active project
  const updateActiveProject = (updater) => {
    setProjects(prev =>
      prev.map(proj => {
        if (proj.id !== activeProject.id) return proj;
        return typeof updater === 'function' ? updater(proj) : { ...proj, ...updater };
      })
    );
  };

  // Trigger Toast Notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to lookup current DB price
  const getDbRate = (id) => {
    const found = unitDb.find((i) => i.id === id);
    return found
      ? { materialCost: found.materialCost, laborCost: found.laborCost, unit: found.unit }
      : { materialCost: 0, laborCost: 0, unit: 'unit' };
  };

  // ==========================================
  // PORTFOLIO-WIDE SUMMARY & PROJECT ACTIONS
  // ==========================================
  const portfolioSummary = useMemo(() => {
    let totalPortfolioBid = 0;
    let totalPortfolioDirect = 0;
    let totalPortfolioProfit = 0;
    let activeCount = 0;

    const enrichedProjects = projects.map(proj => {
      const fin = calculateProjectFinancials(proj.boqItems);
      if (proj.status !== 'Archived') {
        totalPortfolioBid += fin.grandTotal;
        totalPortfolioDirect += fin.totalDirect;
        totalPortfolioProfit += fin.totalProfit;
        activeCount += 1;
      }
      return {
        ...proj,
        financials: fin
      };
    });

    return {
      enrichedProjects,
      totalPortfolioBid,
      totalPortfolioDirect,
      totalPortfolioProfit,
      activeCount
    };
  }, [projects]);

  // New Project Modal / Quick Creation State
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjDraft, setNewProjDraft] = useState({
    projectTitle: '',
    clientName: '',
    location: '',
    status: 'Draft Estimate'
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    const title = newProjDraft.projectTitle.trim() || `New Construction Project #${projects.length + 1}`;
    const newProj = {
      id: `proj-${Date.now()}`,
      projectTitle: title,
      clientName: newProjDraft.clientName.trim() || 'Prospective Client / Owner',
      location: newProjDraft.location.trim() || 'Metro Manila / Calabarzon',
      status: newProjDraft.status,
      contractorName: activeProject?.contractorName || 'VANGUARD BUILDERS & ENGINEERING SERVICES',
      pcabLicense: activeProject?.pcabLicense || 'PCAB Lic. No. 48291 (Category B)',
      preparedBy: activeProject?.preparedBy || 'Engr. Juan Dela Cruz, RCE',
      prcNumber: activeProject?.prcNumber || 'PRC Reg. No. 0148920',
      date: new Date().toISOString().split('T')[0],
      validityDays: 30,
      mtoHistory: [],
      boqItems: [
        {
          id: `boq-${Date.now()}-1`,
          itemNo: '1001.1',
          description: 'Mobilization, Temporary Facilities & Safety Program (DOLE OSH)',
          division: '1000 General Requirements',
          unit: 'lot',
          qty: 1,
          materialUnitCost: 25000,
          laborUnitCost: 20000,
          ocmPct: 12,
          profitPct: 10,
          vatPct: 12,
        }
      ]
    };

    setProjects(prev => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
    setNewProjDraft({ projectTitle: '', clientName: '', location: '', status: 'Draft Estimate' });
    setShowNewProjectForm(false);
    showToast(`Created "${newProj.projectTitle}" and set as Active Project!`);
  };

  const handleCloneProject = (proj) => {
    const cloned = {
      ...JSON.parse(JSON.stringify(proj)),
      id: `proj-${Date.now()}`,
      projectTitle: `${proj.projectTitle} (Copy)`,
      status: 'Draft Estimate',
      date: new Date().toISOString().split('T')[0]
    };
    setProjects(prev => [cloned, ...prev]);
    setActiveProjectId(cloned.id);
    showToast(`Cloned "${proj.projectTitle}" as a new project template!`);
  };

  const handleDeleteProject = (id) => {
    if (projects.length <= 1) {
      showToast('Cannot delete the last remaining project in your portfolio.');
      return;
    }
    const target = projects.find(p => p.id === id);
    const remaining = projects.filter(p => p.id !== id);
    setProjects(remaining);
    if (activeProjectId === id) {
      setActiveProjectId(remaining[0].id);
    }
    showToast(`Deleted project "${target?.projectTitle || 'Project'}"`);
  };

  const handleStatusChange = (id, newStatus) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, status: newStatus } : p)));
    showToast(`Updated project status to "${newStatus}"`);
  };

  // ==========================================
  // JSON BACKUP EXPORT & IMPORT HANDLERS
  // ==========================================
  const exportFullPortfolioJSON = () => {
    const payload = {
      app: 'ProEstimate PH Multi-Project Portfolio',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      activeProjectId,
      unitDb,
      projects
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ProEstimatePH_Portfolio_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported Full Portfolio & Unit Database (.json)!');
  };

  const exportSingleProjectJSON = (proj) => {
    const payload = {
      app: 'ProEstimate PH Single Project File',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      project: proj
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Project_${proj.projectTitle.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported "${proj.projectTitle}" (.json)!`);
  };

  const handleImportJSONFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        // Case 1: Full Portfolio Backup
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
          setActiveProjectId(data.activeProjectId || data.projects[0].id);
          if (Array.isArray(data.unitDb)) setUnitDb(data.unitDb);
          showToast(`Restored ${data.projects.length} projects from backup file!`);
        }
        // Case 2: Single Project Export File
        else if (data.project && data.project.projectTitle) {
          const importedProj = {
            ...data.project,
            id: `proj-${Date.now()}`
          };
          setProjects(prev => [importedProj, ...prev]);
          setActiveProjectId(importedProj.id);
          showToast(`Imported project "${importedProj.projectTitle}" into your portfolio!`);
        } else {
          showToast('Invalid JSON format. Please upload a valid ProEstimate PH .json file.');
        }
      } catch (err) {
        console.error('JSON Import Error:', err);
        showToast('Error reading JSON file. Please check the file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDemoData = () => {
    setProjects(DEFAULT_PROJECTS);
    setActiveProjectId(DEFAULT_PROJECTS[0].id);
    setUnitDb(INITIAL_UNIT_DB);
    showToast('Restored default 3 Philippine demo projects & baseline prices!');
  };

  // Global Markup State for Bulk Apply in Active Project
  const [globalMarkup, setGlobalMarkup] = useState({
    ocmPct: 12,
    profitPct: 10,
    vatPct: 12
  });

  // ==========================================
  // MODULE 1A: CONCRETE MTO STATE & LOGIC
  // ==========================================
  const [concreteForm, setConcreteForm] = useState({
    elementName: 'Column C1 (Ground to 2nd Flr)',
    concreteClass: 'Class A',
    length: 0.40,
    width: 0.40,
    height: 3.20,
    qty: 12,
    wastePct: 5
  });

  const concreteCalc = useMemo(() => {
    const rawVol = (Number(concreteForm.length) || 0) * (Number(concreteForm.width) || 0) * (Number(concreteForm.height) || 0) * (Number(concreteForm.qty) || 0);
    const netVol = rawVol * (1 + (Number(concreteForm.wastePct) || 0) / 100);
    const multipliers = {
      'Class AA': 12.0,
      'Class A': 9.0,
      'Class B': 7.5,
      'Class C': 6.0
    };
    const mult = multipliers[concreteForm.concreteClass] || 9.0;
    const cementBags = Math.ceil(netVol * mult);
    const sandCum = Number((netVol * 0.5).toFixed(2));
    const gravelCum = Number((netVol * 1.0).toFixed(2));

    const cemRate = getDbRate('MAT-CEM-40');
    const sandRate = getDbRate('MAT-SAND');
    const gravRate = getDbRate('MAT-GRAVEL');

    const estDirectCost =
      cementBags * (cemRate.materialCost + cemRate.laborCost) +
      sandCum * (sandRate.materialCost + sandRate.laborCost) +
      gravelCum * (gravRate.materialCost + gravRate.laborCost);

    return { rawVol, netVol, cementBags, sandCum, gravelCum, estDirectCost };
  }, [concreteForm, unitDb]);

  const pushConcreteToBoq = () => {
    if (concreteCalc.netVol <= 0) return;
    const cemRate = getDbRate('MAT-CEM-40');
    const sandRate = getDbRate('MAT-SAND');
    const gravRate = getDbRate('MAT-GRAVEL');
    const existingCount = activeProject.boqItems.filter(i => i.division.startsWith('3000')).length + 1;
    const baseCode = `300${existingCount}`;

    const newItems = [
      {
        id: `boq-${Date.now()}-1`,
        itemNo: `${baseCode}.1`,
        description: `Portland Cement 40kg — ${concreteForm.elementName} (${concreteForm.concreteClass})`,
        division: '3000 Concrete Works',
        unit: 'bags',
        qty: concreteCalc.cementBags,
        materialUnitCost: cemRate.materialCost,
        laborUnitCost: cemRate.laborCost,
        ocmPct: globalMarkup.ocmPct,
        profitPct: globalMarkup.profitPct,
        vatPct: globalMarkup.vatPct,
      },
      {
        id: `boq-${Date.now()}-2`,
        itemNo: `${baseCode}.2`,
        description: `Washed Sand S1 — ${concreteForm.elementName}`,
        division: '3000 Concrete Works',
        unit: 'cu.m',
        qty: concreteCalc.sandCum,
        materialUnitCost: sandRate.materialCost,
        laborUnitCost: sandRate.laborCost,
        ocmPct: globalMarkup.ocmPct,
        profitPct: globalMarkup.profitPct,
        vatPct: globalMarkup.vatPct,
      },
      {
        id: `boq-${Date.now()}-3`,
        itemNo: `${baseCode}.3`,
        description: `Crushed Gravel 3/4" — ${concreteForm.elementName}`,
        division: '3000 Concrete Works',
        unit: 'cu.m',
        qty: concreteCalc.gravelCum,
        materialUnitCost: gravRate.materialCost,
        laborUnitCost: gravRate.laborCost,
        ocmPct: globalMarkup.ocmPct,
        profitPct: globalMarkup.profitPct,
        vatPct: globalMarkup.vatPct,
      }
    ];

    const logEntry = {
      id: Date.now(),
      type: 'Concrete Works',
      title: `${concreteForm.elementName} (${concreteForm.concreteClass})`,
      summary: `${concreteCalc.netVol.toFixed(2)} cu.m | ${concreteCalc.cementBags} bags Cement, ${concreteCalc.sandCum} cu.m Sand, ${concreteCalc.gravelCum} cu.m Gravel`,
      cost: concreteCalc.estDirectCost
    };

    updateActiveProject(proj => ({
      ...proj,
      boqItems: [...proj.boqItems, ...newItems],
      mtoHistory: [logEntry, ...(proj.mtoHistory || [])]
    }));

    showToast(`Added ${concreteForm.elementName} to "${activeProject.projectTitle}" BOQ!`);
  };

  // ==========================================
  // MODULE 1B: CHB MASONRY & PLASTERING LOGIC
  // ==========================================
  const [masonryForm, setMasonryForm] = useState({
    wallId: 'Exterior Wall WF-1 (Grid A-D)',
    chbSize: '6"',
    length: 18.0,
    height: 3.0,
    openingsArea: 6.4,
    plasterFaces: 2,
    plasterThicknessMm: 16,
    wastePct: 5
  });

  const masonryCalc = useMemo(() => {
    const grossArea = (Number(masonryForm.length) || 0) * (Number(masonryForm.height) || 0);
    const netWallArea = Math.max(0, grossArea - (Number(masonryForm.openingsArea) || 0));
    const wasteFactor = 1 + (Number(masonryForm.wastePct) || 0) / 100;

    const chbPcs = Math.ceil(netWallArea * 12.5 * wasteFactor);
    const mortarCementPerSqm = { '4"': 0.522, '5"': 0.792, '6"': 1.018 }[masonryForm.chbSize] || 0.792;
    const mortarSandPerSqm = { '4"': 0.0435, '5"': 0.066, '6"': 0.0848 }[masonryForm.chbSize] || 0.066;

    const plasterVol = netWallArea * Number(masonryForm.plasterFaces) * ((Number(masonryForm.plasterThicknessMm) || 16) / 1000) * wasteFactor;
    const plasterCement = plasterVol * 12;
    const plasterSand = plasterVol * 1.0;

    const totalCementBags = Math.ceil((netWallArea * mortarCementPerSqm * wasteFactor) + plasterCement);
    const totalSandCum = Number(((netWallArea * mortarSandPerSqm * wasteFactor) + plasterSand).toFixed(2));
    const rebar10mmKg = Math.ceil(netWallArea * 3.30 * 0.617 * wasteFactor);
    const tieWireKg = Number((netWallArea * 0.03 * wasteFactor).toFixed(1));

    const chbDbId = masonryForm.chbSize === '4"' ? 'MAT-CHB-4' : masonryForm.chbSize === '5"' ? 'MAT-CHB-5' : 'MAT-CHB-6';
    const chbRate = getDbRate(chbDbId);
    const cemRate = getDbRate('MAT-CEM-40');
    const sandRate = getDbRate('MAT-SAND');
    const rsbRate = getDbRate('MAT-RSB-10');

    const estDirectCost =
      chbPcs * (chbRate.materialCost + chbRate.laborCost) +
      totalCementBags * (cemRate.materialCost + cemRate.laborCost) +
      totalSandCum * (sandRate.materialCost + sandRate.laborCost) +
      rebar10mmKg * (rsbRate.materialCost + rsbRate.laborCost);

    return {
      grossArea,
      netWallArea,
      chbPcs,
      totalCementBags,
      totalSandCum,
      rebar10mmKg,
      tieWireKg,
      estDirectCost,
      chbDbId
    };
  }, [masonryForm, unitDb]);

  const pushMasonryToBoq = () => {
    if (masonryCalc.netWallArea <= 0) return;
    const chbRate = getDbRate(masonryCalc.chbDbId);
    const cemRate = getDbRate('MAT-CEM-40');
    const sandRate = getDbRate('MAT-SAND');
    const rsbRate = getDbRate('MAT-RSB-10');
    const existingCount = activeProject.boqItems.filter(i => i.division.startsWith('4000')).length + 1;
    const baseCode = `400${existingCount}`;

    const newItems = [
      {
        id: `boq-${Date.now()}-m1`,
        itemNo: `${baseCode}.1`,
        description: `CHB ${masonryForm.chbSize} Blocks — ${masonryForm.wallId} (${masonryCalc.netWallArea.toFixed(1)} sq.m net)`,
        division: '4000 Masonry Works',
        unit: 'pcs',
        qty: masonryCalc.chbPcs,
        materialUnitCost: chbRate.materialCost,
        laborUnitCost: chbRate.laborCost,
        ocmPct: globalMarkup.ocmPct,
        profitPct: globalMarkup.profitPct,
        vatPct: globalMarkup.vatPct,
      },
      {
        id: `boq-${Date.now()}-m2`,
        itemNo: `${baseCode}.2`,
        description: `Portland Cement 40kg (CHB Mortar & ${masonryForm.plasterFaces}-Face Plaster) — ${masonryForm.wallId}`,
        division: '4000 Masonry Works',
        unit: 'bags',
        qty: masonryCalc.totalCementBags,
        materialUnitCost: cemRate.materialCost,
        laborUnitCost: cemRate.laborCost,
        ocmPct: globalMarkup.ocmPct,
        profitPct: globalMarkup.profitPct,
        vatPct: globalMarkup.vatPct,
      },
      {
        id: `boq-${Date.now()}-m3`,
        itemNo: `${baseCode}.3`,
        description: `Washed Sand S1 (CHB Mortar & Plaster) — ${masonryForm.wallId}`,
        division: '4000 Masonry Works',
        unit: 'cu.m',
        qty: masonryCalc.totalSandCum,
        materialUnitCost: sandRate.materialCost,
        laborUnitCost: sandRate.laborCost,
        ocmPct: globalMarkup.ocmPct,
        profitPct: globalMarkup.profitPct,
        vatPct: globalMarkup.vatPct,
      },
      {
        id: `boq-${Date.now()}-m4`,
        itemNo: `${baseCode}.4`,
        description: `10mmØ CHB Vertical & Horizontal Dowels/Reinforcement — ${masonryForm.wallId}`,
        division: '5000 Rebar & Structural Steel',
        unit: 'kg',
        qty: masonryCalc.rebar10mmKg,
        materialUnitCost: rsbRate.materialCost,
        laborUnitCost: rsbRate.laborCost,
        ocmPct: globalMarkup.ocmPct,
        profitPct: globalMarkup.profitPct,
        vatPct: globalMarkup.vatPct,
      }
    ];

    const logEntry = {
      id: Date.now(),
      type: 'CHB Masonry',
      title: `${masonryForm.wallId} (${masonryForm.chbSize} CHB)`,
      summary: `${masonryCalc.netWallArea.toFixed(1)} sq.m | ${masonryCalc.chbPcs} pcs CHB, ${masonryCalc.totalCementBags} bags Cement, ${masonryCalc.rebar10mmKg} kg 10mm RSB`,
      cost: masonryCalc.estDirectCost
    };

    updateActiveProject(proj => ({
      ...proj,
      boqItems: [...proj.boqItems, ...newItems],
      mtoHistory: [logEntry, ...(proj.mtoHistory || [])]
    }));

    showToast(`Added ${masonryForm.wallId} to "${activeProject.projectTitle}" BOQ!`);
  };

  // ==========================================
  // MODULE 1C: REBAR (RSB) & TIE WIRE LOGIC
  // ==========================================
  const [rebarForm, setRebarForm] = useState({
    elementName: '2nd Floor Suspended Beam B-1',
    diameterMm: 16,
    commercialLengthM: 6.0,
    cutLengthM: 4.5,
    totalPieces: 36,
    spliceWastePct: 8,
    tieWireFactorPct: 2.0
  });

  const rebarCalc = useMemo(() => {
    const d = Number(rebarForm.diameterMm) || 16;
    const unitWeightKgPerM = (d * d) / 162.2;
    const rawLinearMeters = (Number(rebarForm.cutLengthM) || 0) * (Number(rebarForm.totalPieces) || 0);
    const netLinearMeters = rawLinearMeters * (1 + (Number(rebarForm.spliceWastePct) || 0) / 100);
    const commLen = Number(rebarForm.commercialLengthM) || 6;
    const commercialBarsPcs = Math.ceil(netLinearMeters / commLen);
    const totalWeightKg = Math.ceil(commercialBarsPcs * commLen * unitWeightKgPerM);
    const tieWireKg = Number((totalWeightKg * ((Number(rebarForm.tieWireFactorPct) || 2) / 100)).toFixed(1));

    const rsbDbMap = {
      10: 'MAT-RSB-10',
      12: 'MAT-RSB-12',
      16: 'MAT-RSB-16',
      20: 'MAT-RSB-20',
      25: 'MAT-RSB-25'
    };
    const rsbDbId = rsbDbMap[d] || 'MAT-RSB-16';
    const rsbRate = getDbRate(rsbDbId);
    const tieRate = getDbRate('MAT-GI-16');

    const estDirectCost =
      totalWeightKg * (rsbRate.materialCost + rsbRate.laborCost) +
      tieWireKg * (tieRate.materialCost + tieRate.laborCost);

    return {
      unitWeightKgPerM,
      rawLinearMeters,
      netLinearMeters,
      commercialBarsPcs,
      totalWeightKg,
      tieWireKg,
      estDirectCost,
      rsbDbId
    };
  }, [rebarForm, unitDb]);

  const pushRebarToBoq = () => {
    if (rebarCalc.totalWeightKg <= 0) return;
    const rsbRate = getDbRate(rebarCalc.rsbDbId);
    const tieRate = getDbRate('MAT-GI-16');
    const existingCount = activeProject.boqItems.filter(i => i.division.startsWith('5000')).length + 1;
    const baseCode = `500${existingCount}`;

    const newItems = [
      {
        id: `boq-${Date.now()}-r1`,
        itemNo: `${baseCode}.1`,
        description: `Deformed Rebar ${rebarForm.diameterMm}mmØ (${rebarCalc.commercialBarsPcs} pcs @ ${rebarForm.commercialLengthM}m) — ${rebarForm.elementName}`,
        division: '5000 Rebar & Structural Steel',
        unit: 'kg',
        qty: rebarCalc.totalWeightKg,
        materialUnitCost: rsbRate.materialCost,
        laborUnitCost: rsbRate.laborCost,
        ocmPct: globalMarkup.ocmPct,
        profitPct: globalMarkup.profitPct,
        vatPct: globalMarkup.vatPct,
      },
      {
        id: `boq-${Date.now()}-r2`,
        itemNo: `${baseCode}.2`,
        description: `#16 G.I. Tie Wire — ${rebarForm.elementName}`,
        division: '5000 Rebar & Structural Steel',
        unit: 'kg',
        qty: rebarCalc.tieWireKg,
        materialUnitCost: tieRate.materialCost,
        laborUnitCost: tieRate.laborCost,
        ocmPct: globalMarkup.ocmPct,
        profitPct: globalMarkup.profitPct,
        vatPct: globalMarkup.vatPct,
      }
    ];

    const logEntry = {
      id: Date.now(),
      type: 'Rebar & Steel',
      title: `${rebarForm.elementName} (${rebarForm.diameterMm}mmØ RSB)`,
      summary: `${rebarCalc.commercialBarsPcs} pcs (${rebarForm.commercialLengthM}m) | ${rebarCalc.totalWeightKg} kg RSB + ${rebarCalc.tieWireKg} kg Tie Wire`,
      cost: rebarCalc.estDirectCost
    };

    updateActiveProject(proj => ({
      ...proj,
      boqItems: [...proj.boqItems, ...newItems],
      mtoHistory: [logEntry, ...(proj.mtoHistory || [])]
    }));

    showToast(`Added ${rebarForm.elementName} to "${activeProject.projectTitle}" BOQ!`);
  };

  // ==========================================
  // ACTIVE PROJECT BOQ CALCULATIONS & HANDLERS
  // ==========================================
  const projectTotals = useMemo(() => {
    return calculateProjectFinancials(activeProject?.boqItems || []);
  }, [activeProject]);

  const computedBoq = projectTotals.computedItems;

  const handleBoqChange = (id, field, value) => {
    updateActiveProject(proj => ({
      ...proj,
      boqItems: proj.boqItems.map(item => (item.id === id ? { ...item, [field]: value } : item))
    }));
  };

  const applyGlobalMarkupsToAll = () => {
    updateActiveProject(proj => ({
      ...proj,
      boqItems: proj.boqItems.map(item => ({
        ...item,
        ocmPct: Number(globalMarkup.ocmPct) || 0,
        profitPct: Number(globalMarkup.profitPct) || 0,
        vatPct: Number(globalMarkup.vatPct) || 0
      }))
    }));
    showToast(`Applied ${globalMarkup.ocmPct}% OCM, ${globalMarkup.profitPct}% Profit, ${globalMarkup.vatPct}% VAT to "${activeProject.projectTitle}"!`);
  };

  const addBlankBoqRow = () => {
    updateActiveProject(proj => ({
      ...proj,
      boqItems: [
        ...proj.boqItems,
        {
          id: `boq-${Date.now()}`,
          itemNo: `${proj.boqItems.length + 1}.0`,
          description: 'New Scope of Work / Pay Item',
          division: '3000 Concrete Works',
          unit: 'lot',
          qty: 1,
          materialUnitCost: 5000,
          laborUnitCost: 2500,
          ocmPct: globalMarkup.ocmPct,
          profitPct: globalMarkup.profitPct,
          vatPct: globalMarkup.vatPct
        }
      ]
    }));
  };

  const deleteBoqRow = (id) => {
    updateActiveProject(proj => ({
      ...proj,
      boqItems: proj.boqItems.filter(item => item.id !== id)
    }));
  };

  // Custom Unit Rate Item Addition
  const addCustomDbItem = () => {
    const nextNum = unitDb.length + 1;
    const newItem = {
      id: `MAT-CUST-${Date.now()}`,
      code: `MAT-0${nextNum}`,
      name: 'New Construction Material / Labor Rate',
      category: 'Concrete & Masonry',
      unit: 'pcs',
      materialCost: 150,
      laborCost: 65
    };
    setUnitDb(prev => [...prev, newItem]);
    showToast('Added new custom item row to Unit Rate Database!');
  };

  // ==========================================
  // EXPORT ACTIVE PROJECT BOQ TO CSV (EXCEL)
  // ==========================================
  const exportBoqToCSV = () => {
    const headers = [
      'Pay Item No.',
      'Work Description',
      'Division',
      'Unit',
      'Qty',
      'Material Unit Cost (PHP)',
      'Labor Unit Cost (PHP)',
      'Total Direct Cost (PHP)',
      'OCM %',
      'Profit %',
      'VAT %',
      'Unit Bid Price (PHP)',
      'Total Bid Amount (PHP)'
    ];

    const rows = computedBoq.map(item => [
      `"${item.itemNo}"`,
      `"${item.description.replace(/"/g, '""')}"`,
      `"${item.division}"`,
      `"${item.unit}"`,
      item.qty,
      item.materialUnitCost,
      item.laborUnitCost,
      item.directCost.toFixed(2),
      item.ocmPct,
      item.profitPct,
      item.vatPct,
      item.unitBidPrice.toFixed(2),
      item.totalAmount.toFixed(2)
    ]);

    rows.push([]);
    rows.push(['', `PROJECT: ${activeProject.projectTitle}`, `CLIENT: ${activeProject.clientName}`, '', '', '', '', projectTotals.totalDirect.toFixed(2), '', '', '', '', projectTotals.grandTotal.toFixed(2)]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BOQ_${activeProject.projectTitle.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded Excel CSV for "${activeProject.projectTitle}"!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Hidden File Input for JSON Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportJSONFile}
        className="hidden"
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-400/40 flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Engineering & Multi-Project Header Bar */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-30 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3.5">
          {/* Brand + Active Project Quick Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-950/50 shrink-0">
                <Building2 className="w-6 h-6 text-slate-950 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-white">
                    ProEstimate <span className="text-emerald-400">PH</span>
                  </h1>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Multi-Project v2.0
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>DPWH / Fajardo Standard</span>
                  <span>•</span>
                  <span className="text-emerald-400/90 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Auto-saved ({lastSavedTime})
                  </span>
                </div>
              </div>
            </div>

            {/* Active Project Selector Dropdown */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
              <FolderKanban className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Active Project ({projects.length} in Portfolio)
                </span>
                <select
                  value={activeProject.id}
                  onChange={(e) => {
                    setActiveProjectId(e.target.value);
                    const chosen = projects.find(p => p.id === e.target.value);
                    if (chosen) showToast(`Switched active project to "${chosen.projectTitle}"`);
                  }}
                  className="bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer pr-2 max-w-[240px] sm:max-w-[320px] truncate"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.projectTitle} [{p.status}]
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Live Active Project Cost Ticker */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3 sm:gap-5 bg-slate-950/90 border border-slate-800 px-4 py-2 rounded-xl">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Active Direct Cost</span>
              <span className="font-mono text-xs sm:text-sm font-semibold text-slate-200">
                {formatPHP(projectTotals.totalDirect)}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-800 hidden sm:block" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">OCM + Profit + VAT</span>
              <span className="font-mono text-xs sm:text-sm font-semibold text-amber-400">
                {formatPHP(projectTotals.totalOcm + projectTotals.totalProfit + projectTotals.totalVat)}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-800 hidden sm:block" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold block">Active Project Bid</span>
              <span className="font-mono text-sm sm:text-base font-bold text-emerald-400">
                {formatPHP(projectTotals.grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar border-t border-slate-800/80">
          {[
            { id: 'portfolio', label: '1. Project Portfolio Dashboard', icon: FolderKanban, badge: `${projects.length} Projects` },
            { id: 'mto', label: '2. Automated MTO Calculators', icon: Calculator, badge: '3 Modules' },
            { id: 'boq', label: '3. Master BOQ & Markup Engine', icon: FileSpreadsheet, badge: `${activeProject.boqItems.length} Items` },
            { id: 'db', label: '4. PH Unit Price Database', icon: Database, badge: `${unitDb.length} Rates` },
            { id: 'proposal', label: '5. Client Bid Proposal & Export', icon: FileCheck2, badge: 'White-Label' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* =========================================================
            TAB 1: MULTI-PROJECT PORTFOLIO DASHBOARD & BACKUP
           ========================================================= */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            {/* Top Action Bar: Create, Backup JSON, Restore JSON */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                  Contractor Multi-Project Portfolio & Bid Pipeline
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage multiple residential, commercial, and DPWH infrastructure estimates simultaneously. Everything auto-saves to your browser and can be backed up as `.json` files.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setShowNewProjectForm(!showNewProjectForm)}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  New Project Estimate
                </button>
                <button
                  onClick={exportFullPortfolioJSON}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                  title="Download all projects and unit rates as a JSON backup file"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  Export Portfolio (.json)
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                  title="Import a single project or full portfolio .json file"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  Import Project / Backup (.json)
                </button>
                <button
                  onClick={handleResetDemoData}
                  className="px-3 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                  title="Restore the default 3 Philippine sample projects"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Demo
                </button>
              </div>
            </div>

            {/* Collapsible New Project Creation Form */}
            {showNewProjectForm && (
              <form
                onSubmit={handleCreateProject}
                className="bg-slate-900/90 border-2 border-emerald-500/40 rounded-2xl p-5 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                    Create New Construction Project Estimate
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowNewProjectForm(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 3-Storey Commercial Bldg - Pasig"
                      value={newProjDraft.projectTitle}
                      onChange={e => setNewProjDraft({ ...newProjDraft, projectTitle: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Client / Owner Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Golden Horizon Realty Inc."
                      value={newProjDraft.clientName}
                      onChange={e => setNewProjDraft({ ...newProjDraft, clientName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Site Location</label>
                    <input
                      type="text"
                      placeholder="e.g., Brgy. Kapitolyo, Pasig City"
                      value={newProjDraft.location}
                      onChange={e => setNewProjDraft({ ...newProjDraft, location: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Initial Bid Status</label>
                    <select
                      value={newProjDraft.status}
                      onChange={e => setNewProjDraft({ ...newProjDraft, status: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    >
                      {PROJECT_STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Create & Open Project
                  </button>
                </div>
              </form>
            )}

            {/* Portfolio KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Total Portfolio Bid Value
                </span>
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400 mt-1.5 block">
                  {formatPHP(portfolioSummary.totalPortfolioBid)}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Across {portfolioSummary.activeCount} non-archived projects
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Total Direct Cost (Mat + Lab)
                </span>
                <span className="text-xl sm:text-2xl font-mono font-bold text-white mt-1.5 block">
                  {formatPHP(portfolioSummary.totalPortfolioDirect)}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Combined material & labor capital
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 block">
                  Projected Net Contractor Profit
                </span>
                <span className="text-xl sm:text-2xl font-mono font-bold text-amber-400 mt-1.5 block">
                  {formatPHP(portfolioSummary.totalPortfolioProfit)}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Excludes OCM & 12% VAT allocation
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-400 block">
                  Currently Active Workspace
                </span>
                <span className="text-sm font-bold text-white mt-1.5 block truncate">
                  {activeProject.projectTitle}
                </span>
                <button
                  onClick={() => setActiveTab('boq')}
                  className="text-xs text-emerald-400 hover:underline mt-2 inline-flex items-center gap-1 font-medium"
                >
                  Open Master BOQ <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {portfolioSummary.enrichedProjects.map((proj) => {
                const isSelected = proj.id === activeProject.id;
                const fin = proj.financials;
                return (
                  <div
                    key={proj.id}
                    className={`rounded-2xl p-5 flex flex-col justify-between transition-all border ${
                      isSelected
                        ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-emerald-500/60 shadow-xl shadow-emerald-950/30'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Top Status & Active Badge Row */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <select
                          value={proj.status}
                          onChange={(e) => handleStatusChange(proj.id, e.target.value)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusBadgeStyle(proj.status)}`}
                        >
                          {PROJECT_STATUSES.map(st => (
                            <option key={st} value={st} className="bg-slate-900 text-white">
                              {st}
                            </option>
                          ))}
                        </select>

                        {isSelected ? (
                          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Active Workspace
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveProjectId(proj.id);
                              showToast(`Switched active project to "${proj.projectTitle}"`);
                            }}
                            className="text-xs text-slate-400 hover:text-emerald-400 font-medium cursor-pointer"
                          >
                            Select Project
                          </button>
                        )}
                      </div>

                      {/* Project Title & Metadata */}
                      <h3
                        onClick={() => setActiveProjectId(proj.id)}
                        className="text-base font-bold text-white hover:text-emerald-400 cursor-pointer transition-colors leading-snug"
                      >
                        {proj.projectTitle}
                      </h3>

                      <div className="mt-2.5 space-y-1 text-xs text-slate-400">
                        <p className="flex items-center gap-1.5 truncate">
                          <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{proj.clientName}</span>
                        </p>
                        <p className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{proj.location}</span>
                        </p>
                      </div>

                      {/* Financial Breakdown Mini-Box */}
                      <div className="mt-4 bg-slate-950/90 border border-slate-800/90 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Direct Cost ({proj.boqItems.length} items):</span>
                          <span className="font-mono text-slate-200 font-semibold">
                            {formatPHP(fin.totalDirect)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Projected Net Profit:</span>
                          <span className="font-mono text-amber-400 font-semibold">
                            {formatPHP(fin.totalProfit)}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400 uppercase">Total Bid Price:</span>
                          <span className="font-mono text-sm font-extrabold text-emerald-400">
                            {formatPHP(fin.grandTotal)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setActiveProjectId(proj.id);
                            setActiveTab('mto');
                          }}
                          className="px-2.5 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                        >
                          MTO
                        </button>
                        <button
                          onClick={() => {
                            setActiveProjectId(proj.id);
                            setActiveTab('boq');
                          }}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                        >
                          Edit BOQ
                        </button>
                        <button
                          onClick={() => {
                            setActiveProjectId(proj.id);
                            setActiveTab('proposal');
                          }}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                        >
                          Proposal
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCloneProject(proj)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Duplicate / Clone Project as Template"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => exportSingleProjectJSON(proj)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Export Single Project (.json)"
                        >
                          <FileJson className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: AUTOMATED MTO CALCULATORS (SCOPED TO ACTIVE PROJECT)
           ========================================================= */}
        {activeTab === 'mto' && (
          <div className="space-y-6">
            {/* Sub-module Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h2 className="text-base font-bold text-white">
                    Engineering Material Take-Off (MTO) — <span className="text-emerald-400">{activeProject.projectTitle}</span>
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Compute exact cement bags, aggregates, CHB, and rebar weights and push directly into <span className="text-slate-200 font-medium">{activeProject.projectTitle}</span>&apos;s Master BOQ.
                </p>
              </div>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start">
                {[
                  { id: 'concrete', label: 'Concrete Works', icon: Layers },
                  { id: 'masonry', label: 'CHB & Plastering', icon: Grid },
                  { id: 'rebar', label: 'Rebar & Tie Wire', icon: Hammer }
                ].map(mod => {
                  const ModIcon = mod.icon;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setActiveMtoModule(mod.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeMtoModule === mod.id
                          ? 'bg-emerald-500 text-slate-950 shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <ModIcon className="w-3.5 h-3.5" />
                      {mod.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT: MTO INPUT FORM (7 Cols) */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
                {/* 1A: CONCRETE CALCULATOR */}
                {activeMtoModule === 'concrete' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                          Concrete Proportioning Calculator (Fajardo / Fuller&apos;s Method)
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          40kg Portland Cement Bag Multipliers • Sand = 0.50 × Vol • Gravel = 1.00 × Vol
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Structural Element Name / Mark
                        </label>
                        <input
                          type="text"
                          value={concreteForm.elementName}
                          onChange={e => setConcreteForm({ ...concreteForm, elementName: e.target.value })}
                          placeholder="e.g., Footing F1, Column C1, Slab on Grade"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Concrete Class Mixture (40kg Bag)
                        </label>
                        <select
                          value={concreteForm.concreteClass}
                          onChange={e => setConcreteForm({ ...concreteForm, concreteClass: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                        >
                          <option value="Class AA">Class AA (1:1.5:3) — 12.0 bags/cu.m</option>
                          <option value="Class A">Class A (1:2:4) — 9.0 bags/cu.m (Footings/Beams/Cols)</option>
                          <option value="Class B">Class B (1:2.5:5) — 7.5 bags/cu.m (Slabs on Fill)</option>
                          <option value="Class C">Class C (1:3:6) — 6.0 bags/cu.m (Lean Concrete)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Number of Identical Elements (Qty)
                        </label>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={concreteForm.qty}
                          onChange={e => setConcreteForm({ ...concreteForm, qty: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Length / Span (meters)
                        </label>
                        <input
                          type="number"
                          step="0.05"
                          value={concreteForm.length}
                          onChange={e => setConcreteForm({ ...concreteForm, length: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Width / Breadth (meters)
                        </label>
                        <input
                          type="number"
                          step="0.05"
                          value={concreteForm.width}
                          onChange={e => setConcreteForm({ ...concreteForm, width: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Thickness / Height / Depth (meters)
                        </label>
                        <input
                          type="number"
                          step="0.05"
                          value={concreteForm.height}
                          onChange={e => setConcreteForm({ ...concreteForm, height: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Waste / Shrinkage Allowance (%)
                        </label>
                        <input
                          type="number"
                          step="1"
                          value={concreteForm.wastePct}
                          onChange={e => setConcreteForm({ ...concreteForm, wastePct: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 1B: CHB MASONRY & PLASTERING CALCULATOR */}
                {activeMtoModule === 'masonry' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                          CHB Wall, Mortar, Plaster & Dowel Rebar Calculator
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Standard 12.5 pcs CHB/sq.m • Includes Block Mortar, Face Plastering & 10mmØ Rebar
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Wall Section ID / Location
                        </label>
                        <input
                          type="text"
                          value={masonryForm.wallId}
                          onChange={e => setMasonryForm({ ...masonryForm, wallId: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          CHB Thickness Size
                        </label>
                        <select
                          value={masonryForm.chbSize}
                          onChange={e => setMasonryForm({ ...masonryForm, chbSize: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                        >
                          <option value='4"'>4" CHB (100mm x 200mm x 400mm) — Interior</option>
                          <option value='5"'>5" CHB (125mm x 200mm x 400mm)</option>
                          <option value='6"'>6" CHB (150mm x 200mm x 400mm) — Exterior/Firewall</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Plastering Faces (16mm Standard)
                        </label>
                        <select
                          value={masonryForm.plasterFaces}
                          onChange={e => setMasonryForm({ ...masonryForm, plasterFaces: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                        >
                          <option value={2}>Both Faces Plastered (2 Sides)</option>
                          <option value={1}>One Face Plastered (1 Side Only)</option>
                          <option value={0}>No Plastering (CHB Laying Only)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Total Wall Length (meters)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={masonryForm.length}
                          onChange={e => setMasonryForm({ ...masonryForm, length: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Wall Height (meters)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={masonryForm.height}
                          onChange={e => setMasonryForm({ ...masonryForm, height: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Doors & Windows Area Deduction (sq.m)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={masonryForm.openingsArea}
                          onChange={e => setMasonryForm({ ...masonryForm, openingsArea: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Breakage & Waste Allowance (%)
                        </label>
                        <input
                          type="number"
                          step="1"
                          value={masonryForm.wastePct}
                          onChange={e => setMasonryForm({ ...masonryForm, wastePct: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 1C: REBAR & TIE WIRE CALCULATOR */}
                {activeMtoModule === 'rebar' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                          Deformed Rebar (RSB) & #16 G.I. Tie Wire Calculator
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Unit Weight Formula: W = D² / 162.2 (kg/m) • Commercial Bar Lengths: 6m to 12m
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Structural Member / Rebar Schedule Group
                        </label>
                        <input
                          type="text"
                          value={rebarForm.elementName}
                          onChange={e => setRebarForm({ ...rebarForm, elementName: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Bar Diameter (mmØ)
                        </label>
                        <select
                          value={rebarForm.diameterMm}
                          onChange={e => setRebarForm({ ...rebarForm, diameterMm: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                        >
                          <option value={10}>10mmØ (0.617 kg/m — Stirrups / Ties)</option>
                          <option value={12}>12mmØ (0.888 kg/m — Slabs / Secondary)</option>
                          <option value={16}>16mmØ (1.578 kg/m — Columns / Beams)</option>
                          <option value={20}>20mmØ (2.466 kg/m — Heavy Girders)</option>
                          <option value={25}>25mmØ (3.853 kg/m — Main Columns)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Commercial Steel Length (meters)
                        </label>
                        <select
                          value={rebarForm.commercialLengthM}
                          onChange={e => setRebarForm({ ...rebarForm, commercialLengthM: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                        >
                          <option value={6.0}>6.0 meters (Standard Commercial)</option>
                          <option value={7.5}>7.5 meters</option>
                          <option value={9.0}>9.0 meters</option>
                          <option value={10.5}>10.5 meters</option>
                          <option value={12.0}>12.0 meters</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Cut Length per Piece (meters)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={rebarForm.cutLengthM}
                          onChange={e => setRebarForm({ ...rebarForm, cutLengthM: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Total Number of Cut Pieces Needed
                        </label>
                        <input
                          type="number"
                          step="1"
                          value={rebarForm.totalPieces}
                          onChange={e => setRebarForm({ ...rebarForm, totalPieces: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Lapping / Hooks / Splice Waste (%)
                        </label>
                        <input
                          type="number"
                          step="1"
                          value={rebarForm.spliceWastePct}
                          onChange={e => setRebarForm({ ...rebarForm, spliceWastePct: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          #16 G.I. Tie Wire Allowance (% of RSB Wt)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={rebarForm.tieWireFactorPct}
                          onChange={e => setRebarForm({ ...rebarForm, tieWireFactorPct: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: LIVE MTO OUTPUT & ONE-CLICK PUSH TO ACTIVE BOQ (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-xl">
                {activeMtoModule === 'concrete' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        Computed Concrete Quantities
                      </span>
                      <span className="text-xs font-mono bg-slate-800 px-2.5 py-1 rounded-md text-slate-300">
                        Net Vol: {concreteCalc.netVol.toFixed(2)} cu.m
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] text-slate-400 block">40kg Cement</span>
                        <span className="text-xl font-bold font-mono text-white mt-1 block">
                          {concreteCalc.cementBags}
                        </span>
                        <span className="text-[11px] text-emerald-400">bags</span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] text-slate-400 block">Washed Sand</span>
                        <span className="text-xl font-bold font-mono text-white mt-1 block">
                          {concreteCalc.sandCum}
                        </span>
                        <span className="text-[11px] text-emerald-400">cu.m</span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] text-slate-400 block">Gravel 3/4&quot;</span>
                        <span className="text-xl font-bold font-mono text-white mt-1 block">
                          {concreteCalc.gravelCum}
                        </span>
                        <span className="text-[11px] text-emerald-400">cu.m</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">Estimated Direct Cost (Mat + Lab)</span>
                        <span className="text-[11px] text-slate-500">Based on PH Unit Price Database</span>
                      </div>
                      <span className="text-lg font-mono font-bold text-amber-400">
                        {formatPHP(concreteCalc.estDirectCost)}
                      </span>
                    </div>

                    <button
                      onClick={pushConcreteToBoq}
                      className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      Push to Active Project BOQ
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {activeMtoModule === 'masonry' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        Computed CHB & Plaster Quantities
                      </span>
                      <span className="text-xs font-mono bg-slate-800 px-2.5 py-1 rounded-md text-slate-300">
                        Net Wall: {masonryCalc.netWallArea.toFixed(2)} sq.m
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] text-slate-400 block">{masonryForm.chbSize} CHB Blocks</span>
                        <span className="text-xl font-bold font-mono text-white mt-1 block">
                          {masonryCalc.chbPcs.toLocaleString()} <span className="text-xs font-normal text-emerald-400">pcs</span>
                        </span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] text-slate-400 block">Cement (Mortar+Plaster)</span>
                        <span className="text-xl font-bold font-mono text-white mt-1 block">
                          {masonryCalc.totalCementBags} <span className="text-xs font-normal text-emerald-400">bags</span>
                        </span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] text-slate-400 block">Washed Sand</span>
                        <span className="text-xl font-bold font-mono text-white mt-1 block">
                          {masonryCalc.totalSandCum} <span className="text-xs font-normal text-emerald-400">cu.m</span>
                        </span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] text-slate-400 block">10mmØ Dowels / Rebar</span>
                        <span className="text-xl font-bold font-mono text-white mt-1 block">
                          {masonryCalc.rebar10mmKg} <span className="text-xs font-normal text-emerald-400">kg</span>
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">Estimated Direct Cost (Mat + Lab)</span>
                        <span className="text-[11px] text-slate-500">Includes CHB, Mortar, Plaster & Rebar</span>
                      </div>
                      <span className="text-lg font-mono font-bold text-amber-400">
                        {formatPHP(masonryCalc.estDirectCost)}
                      </span>
                    </div>

                    <button
                      onClick={pushMasonryToBoq}
                      className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      Push to Active Project BOQ
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {activeMtoModule === 'rebar' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        Computed Rebar & Tie Wire
                      </span>
                      <span className="text-xs font-mono bg-slate-800 px-2.5 py-1 rounded-md text-slate-300">
                        Unit Wt: {rebarCalc.unitWeightKgPerM.toFixed(3)} kg/m
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] text-slate-400 block">Commercial Bars</span>
                        <span className="text-xl font-bold font-mono text-white mt-1 block">
                          {rebarCalc.commercialBarsPcs}
                        </span>
                        <span className="text-[11px] text-emerald-400">pcs @ {rebarForm.commercialLengthM}m</span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] text-slate-400 block">Total RSB Weight</span>
                        <span className="text-xl font-bold font-mono text-white mt-1 block">
                          {rebarCalc.totalWeightKg.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-emerald-400">kilograms</span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl">
                        <span className="text-[11px] text-slate-400 block">#16 G.I. Tie Wire</span>
                        <span className="text-xl font-bold font-mono text-white mt-1 block">
                          {rebarCalc.tieWireKg}
                        </span>
                        <span className="text-[11px] text-emerald-400">kilograms</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">Estimated Direct Cost (Mat + Lab)</span>
                        <span className="text-[11px] text-slate-500">Includes Fabrication & Installation Labor</span>
                      </div>
                      <span className="text-lg font-mono font-bold text-amber-400">
                        {formatPHP(rebarCalc.estDirectCost)}
                      </span>
                    </div>

                    <button
                      onClick={pushRebarToBoq}
                      className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      Push to Active Project BOQ
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Recent Take-Off Log for Active Project */}
                <div className="mt-6 pt-4 border-t border-slate-800/90">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Project Take-Off Log ({(activeProject.mtoHistory || []).length})
                    </span>
                    {(activeProject.mtoHistory || []).length > 0 && (
                      <button
                        onClick={() => setActiveTab('boq')}
                        className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        View in BOQ <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  {(activeProject.mtoHistory || []).length === 0 ? (
                    <p className="text-xs text-slate-500 italic">
                      Click &quot;Push to Active Project BOQ&quot; above to log take-off items into {activeProject.projectTitle}.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {(activeProject.mtoHistory || []).map(log => (
                        <div key={log.id} className="bg-slate-950 border border-slate-800/90 px-3 py-2 rounded-lg text-xs flex items-center justify-between gap-2">
                          <div>
                            <span className="font-semibold text-slate-200">{log.title}</span>
                            <p className="text-[11px] text-slate-400">{log.summary}</p>
                          </div>
                          <span className="font-mono text-emerald-400 font-semibold shrink-0">
                            {formatPHP(log.cost, 0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: MASTER BOQ & MARKUP ENGINE (ACTIVE PROJECT)
           ========================================================= */}
        {activeTab === 'boq' && (
          <div className="space-y-6">
            {/* Bulk Contractor Markup Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-base font-bold text-white">
                    Master BOQ — <span className="text-emerald-400">{activeProject.projectTitle}</span>
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adjust Overhead, Contingencies & Miscellaneous (OCM), Contractor&apos;s Profit, and VAT across all line items for this project.
                </p>
              </div>

              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">OCM (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={globalMarkup.ocmPct}
                    onChange={e => setGlobalMarkup({ ...globalMarkup, ocmPct: e.target.value })}
                    className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Profit (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={globalMarkup.profitPct}
                    onChange={e => setGlobalMarkup({ ...globalMarkup, profitPct: e.target.value })}
                    className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">VAT / Tax (%)</label>
                  <input
                    type="number"
                    step="1"
                    value={globalMarkup.vatPct}
                    onChange={e => setGlobalMarkup({ ...globalMarkup, vatPct: e.target.value })}
                    className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                  />
                </div>
                <button
                  onClick={applyGlobalMarkupsToAll}
                  className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Apply Markups to Project
                </button>
                <button
                  onClick={addBlankBoqRow}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  Add Line Item
                </button>
                <button
                  onClick={exportBoqToCSV}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Excel CSV
                </button>
              </div>
            </div>

            {/* Editable BOQ Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/90 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-3">Item No</th>
                      <th className="py-3 px-3 min-w-[240px]">Scope / Description</th>
                      <th className="py-3 px-3 min-w-[160px]">Division</th>
                      <th className="py-3 px-2">Unit</th>
                      <th className="py-3 px-2 text-right">Qty</th>
                      <th className="py-3 px-2 text-right">Mat Unit (₱)</th>
                      <th className="py-3 px-2 text-right">Lab Unit (₱)</th>
                      <th className="py-3 px-3 text-right text-slate-200">Direct Cost (₱)</th>
                      <th className="py-3 px-2 text-right">OCM%</th>
                      <th className="py-3 px-2 text-right">Prof%</th>
                      <th className="py-3 px-2 text-right">VAT%</th>
                      <th className="py-3 px-3 text-right text-amber-300">Unit Bid (₱)</th>
                      <th className="py-3 px-3 text-right text-emerald-400">Total Amount (₱)</th>
                      <th className="py-3 px-2 text-center">Del</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-xs">
                    {computedBoq.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={item.itemNo}
                            onChange={e => handleBoqChange(item.id, 'itemNo', e.target.value)}
                            className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 font-mono text-xs text-slate-300"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={item.description}
                            onChange={e => handleBoqChange(item.id, 'description', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <select
                            value={item.division}
                            onChange={e => handleBoqChange(item.id, 'division', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300"
                          >
                            {DIVISIONS.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 px-2">
                          <input
                            type="text"
                            value={item.unit}
                            onChange={e => handleBoqChange(item.id, 'unit', e.target.value)}
                            className="w-14 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-center font-mono text-xs text-slate-300"
                          />
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <input
                            type="number"
                            step="0.1"
                            value={item.qty}
                            onChange={e => handleBoqChange(item.id, 'qty', e.target.value)}
                            className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-right font-mono text-xs text-white"
                          />
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <input
                            type="number"
                            step="1"
                            value={item.materialUnitCost}
                            onChange={e => handleBoqChange(item.id, 'materialUnitCost', e.target.value)}
                            className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-right font-mono text-xs text-slate-200"
                          />
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <input
                            type="number"
                            step="1"
                            value={item.laborUnitCost}
                            onChange={e => handleBoqChange(item.id, 'laborUnitCost', e.target.value)}
                            className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-right font-mono text-xs text-slate-200"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-200">
                          {formatPHP(item.directCost)}
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <input
                            type="number"
                            step="1"
                            value={item.ocmPct}
                            onChange={e => handleBoqChange(item.id, 'ocmPct', e.target.value)}
                            className="w-14 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-right font-mono text-xs text-slate-300"
                          />
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <input
                            type="number"
                            step="1"
                            value={item.profitPct}
                            onChange={e => handleBoqChange(item.id, 'profitPct', e.target.value)}
                            className="w-14 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-right font-mono text-xs text-slate-300"
                          />
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <input
                            type="number"
                            step="1"
                            value={item.vatPct}
                            onChange={e => handleBoqChange(item.id, 'vatPct', e.target.value)}
                            className="w-14 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-right font-mono text-xs text-slate-300"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-amber-300">
                          {formatPHP(item.unitBidPrice)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                          {formatPHP(item.totalAmount)}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <button
                            onClick={() => deleteBoqRow(item.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                            title="Delete Row"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-950 border-t-2 border-slate-800 font-mono text-xs sm:text-sm font-bold">
                      <td colSpan={7} className="py-4 px-4 text-right text-slate-300 uppercase">
                        {activeProject.projectTitle} — Total Bid Summary:
                      </td>
                      <td className="py-4 px-3 text-right text-white">
                        {formatPHP(projectTotals.totalDirect)}
                      </td>
                      <td colSpan={4} className="py-4 px-3 text-right text-amber-400">
                        Indirect + VAT: {formatPHP(projectTotals.totalOcm + projectTotals.totalProfit + projectTotals.totalVat)}
                      </td>
                      <td className="py-4 px-3 text-right text-emerald-400 text-base">
                        {formatPHP(projectTotals.grandTotal)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: PH UNIT PRICE DATABASE
           ========================================================= */}
        {activeTab === 'db' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  Philippine Construction Material & Labor Unit Rate Database (Auto-Saved)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update your local supplier hardware prices here (NCR / Calabarzon / Regional). All future MTO calculations across all projects automatically pull these rates.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={addCustomDbItem}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  Add Custom Rate
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">Code</th>
                      <th className="py-3.5 px-4">Material / Work Description</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Unit</th>
                      <th className="py-3.5 px-4 text-right">Material Unit Cost (₱)</th>
                      <th className="py-3.5 px-4 text-right">Labor / Installation Cost (₱)</th>
                      <th className="py-3.5 px-4 text-right text-emerald-400">Combined Direct Unit Rate (₱)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-xs sm:text-sm">
                    {unitDb.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-mono text-xs text-slate-400">{item.code}</td>
                        <td className="py-3 px-4 font-medium text-white">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setUnitDb(prev => prev.map(u => u.id === item.id ? { ...u, name: val } : u));
                            }}
                            className="w-full bg-transparent border-b border-transparent focus:border-emerald-400 focus:outline-none text-white"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => {
                              const val = e.target.value;
                              setUnitDb(prev => prev.map(u => u.id === item.id ? { ...u, unit: val } : u));
                            }}
                            className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-center text-slate-200"
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            value={item.materialCost}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 0;
                              setUnitDb(prev => prev.map(u => u.id === item.id ? { ...u, materialCost: val } : u));
                            }}
                            className="w-28 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-right font-mono text-white focus:border-emerald-400 focus:outline-none"
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            value={item.laborCost}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 0;
                              setUnitDb(prev => prev.map(u => u.id === item.id ? { ...u, laborCost: val } : u));
                            }}
                            className="w-28 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-right font-mono text-white focus:border-emerald-400 focus:outline-none"
                          />
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                          {formatPHP(Number(item.materialCost) + Number(item.laborCost))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: CLIENT BID PROPOSAL & WHITE-LABEL EXPORT
           ========================================================= */}
        {activeTab === 'proposal' && (
          <div className="space-y-6">
            {/* White-Label Branding Controls (Scoped to Active Project, Hidden when printing) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 print:hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    White-Label Bid Proposal — <span className="text-emerald-400">{activeProject.projectTitle}</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Customize the company header, PCAB license, client info, and signatory for this project before printing or saving as PDF.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => exportSingleProjectJSON(activeProject)}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-amber-400" />
                    Save Project (.json)
                  </button>
                  <button
                    onClick={exportBoqToCSV}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    Export Excel CSV
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    Print / Save PDF Proposal
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Contractor / Company Name</label>
                  <input
                    type="text"
                    value={activeProject.contractorName}
                    onChange={e => updateActiveProject({ contractorName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">PCAB License / Accreditation</label>
                  <input
                    type="text"
                    value={activeProject.pcabLicense}
                    onChange={e => updateActiveProject({ pcabLicense: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Client / Owner Name</label>
                  <input
                    type="text"
                    value={activeProject.clientName}
                    onChange={e => updateActiveProject({ clientName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Project Title</label>
                  <input
                    type="text"
                    value={activeProject.projectTitle}
                    onChange={e => updateActiveProject({ projectTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-400 mb-1">Project Site Location</label>
                  <input
                    type="text"
                    value={activeProject.location}
                    onChange={e => updateActiveProject({ location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Prepared By (Civil Engineer)</label>
                  <input
                    type="text"
                    value={activeProject.preparedBy}
                    onChange={e => updateActiveProject({ preparedBy: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">PRC Reg. No. / PTR No.</label>
                  <input
                    type="text"
                    value={activeProject.prcNumber}
                    onChange={e => updateActiveProject({ prcNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* EXECUTIVE PROPOSAL DOCUMENT SHEET */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8 print:bg-white print:text-slate-900 print:border-none print:shadow-none">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-6 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block">
                    Official Engineering Cost Estimate & Bid Proposal
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                    {activeProject.contractorName}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">{activeProject.pcabLicense}</p>
                </div>
                <div className="text-left sm:text-right text-xs space-y-1">
                  <p className="text-slate-400">
                    Date: <span className="text-slate-200 font-mono">{activeProject.date}</span>
                  </p>
                  <p className="text-slate-400">
                    Status: <span className="text-emerald-400 font-semibold">{activeProject.status}</span>
                  </p>
                  <p className="text-slate-400">
                    Proposal Validity: <span className="text-slate-200">{activeProject.validityDays} Calendar Days</span>
                  </p>
                </div>
              </div>

              {/* Project Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Prepared For (Project Owner / Client):</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{activeProject.clientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Proposed Project Title:</span>
                  <span className="text-sm font-bold text-emerald-400 mt-0.5 block">{activeProject.projectTitle}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block">Project Site Location:</span>
                  <span className="text-slate-200 font-medium mt-0.5 block">{activeProject.location}</span>
                </div>
              </div>

              {/* Executive Summary Financial Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 block">Direct Material Cost</span>
                  <span className="text-lg font-mono font-bold text-white mt-1 block">
                    {formatPHP(projectTotals.totalMaterial)}
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 block">Direct Labor & Equip</span>
                  <span className="text-lg font-mono font-bold text-white mt-1 block">
                    {formatPHP(projectTotals.totalLabor)}
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <span className="text-[11px] uppercase tracking-wider text-amber-400 block">OCM, Profit & 12% VAT</span>
                  <span className="text-lg font-mono font-bold text-amber-400 mt-1 block">
                    {formatPHP(projectTotals.totalOcm + projectTotals.totalProfit + projectTotals.totalVat)}
                  </span>
                </div>
                <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-xl">
                  <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block">Total Contract Bid Price</span>
                  <span className="text-xl font-mono font-extrabold text-emerald-400 mt-1 block">
                    {formatPHP(projectTotals.grandTotal)}
                  </span>
                </div>
              </div>

              {/* Division-by-Division Breakdown */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Part I: Summary by Construction Work Division
                </h3>
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-900/60">
                        <th className="py-3 px-4">Work Division</th>
                        <th className="py-3 px-4 text-center">Pay Items</th>
                        <th className="py-3 px-4 text-right">Direct Cost (₱)</th>
                        <th className="py-3 px-4 text-right">Total Bid Amount (₱)</th>
                        <th className="py-3 px-4 w-44">Cost Share (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {DIVISIONS.map(div => {
                        const data = projectTotals.divisionMap[div] || { direct: 0, bidTotal: 0, count: 0 };
                        const sharePct = projectTotals.grandTotal > 0 ? (data.bidTotal / projectTotals.grandTotal) * 100 : 0;
                        return (
                          <tr key={div}>
                            <td className="py-3 px-4 font-semibold text-white">{div}</td>
                            <td className="py-3 px-4 text-center font-mono text-slate-400">{data.count}</td>
                            <td className="py-3 px-4 text-right font-mono text-slate-300">{formatPHP(data.direct)}</td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">{formatPHP(data.bidTotal)}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-400 rounded-full"
                                    style={{ width: `${Math.min(100, sharePct)}%` }}
                                  />
                                </div>
                                <span className="font-mono text-xs text-slate-300 w-12 text-right">
                                  {sharePct.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Itemized Bill of Quantities Schedule */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  Part II: Itemized Bill of Quantities (BOQ Schedule)
                </h3>
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-900/60">
                        <th className="py-2.5 px-3">Item No</th>
                        <th className="py-2.5 px-3">Scope / Description</th>
                        <th className="py-2.5 px-3 text-center">Unit</th>
                        <th className="py-2.5 px-3 text-right">Qty</th>
                        <th className="py-2.5 px-3 text-right">Unit Bid Price (₱)</th>
                        <th className="py-2.5 px-3 text-right">Total Amount (₱)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {computedBoq.map(item => (
                        <tr key={item.id}>
                          <td className="py-2.5 px-3 font-mono text-slate-400">{item.itemNo}</td>
                          <td className="py-2.5 px-3 text-white font-medium">{item.description}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-300">{item.unit}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-200">{item.qty}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-amber-300">{formatPHP(item.unitBidPrice)}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">{formatPHP(item.totalAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Signature Block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-8">Prepared & Submitted By:</span>
                  <p className="text-sm font-bold text-white uppercase">{activeProject.preparedBy}</p>
                  <p className="text-slate-400">{activeProject.prcNumber}</p>
                  <p className="text-emerald-400 font-medium mt-0.5">{activeProject.contractorName}</p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-8">Conforme / Approved By (Client/Owner):</span>
                  <p className="text-sm font-bold text-white uppercase">{activeProject.clientName}</p>
                  <p className="text-slate-400">Project Owner / Authorized Representative</p>
                  <p className="text-slate-500 mt-0.5">Date Signed: ________________________</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}