import React, { useState } from 'react';
import {
  Database, Server, Smartphone, Cpu, ShieldCheck, ArrowRight,
  Code2, Layers, CheckCircle2, AlertCircle, Wifi, Cloud, Sparkles,
  Zap, FileJson, Activity, Lock, RefreshCw, HardDrive
} from 'lucide-react';
import { INITIAL_MATERIALS, INITIAL_PRICE_DATASET, VERIFIED_RECYCLERS_DATASET, INITIAL_DEMO_LOTS, INITIAL_COLLECTOR } from '../../services/mockData.js';

export const SystemArchitectureView = () => {
  const [activeDataset, setActiveDataset] = useState('Material');
  const [selectedNode, setSelectedNode] = useState('collector');

  // 6 Relational Datasets matching Section 14 of problem statement
  const datasets = [
    {
      id: 'Material',
      title: '1. Material Dataset (material_id PK)',
      description: 'Physical & chemical metadata of collected e-waste scrap items.',
      fields: [
        { name: 'material_id', type: 'VARCHAR(50) PK', desc: 'Unique material identifier (e.g., PCB, Cable)' },
        { name: 'category', type: 'VARCHAR(100)', desc: 'Primary material group (E-Waste / Ferrous / Non-Ferrous)' },
        { name: 'subcategory', type: 'VARCHAR(100)', desc: 'Motherboard, Heavy Copper Wiring, Li-ion, CRT Tube' },
        { name: 'description', type: 'TEXT', desc: 'Visual features & safety hazard guidelines' },
        { name: 'image_reference', type: 'VARCHAR(255)', desc: 'Object storage S3 URL / image tensor reference' },
        { name: 'weight', type: 'DECIMAL(10,2)', desc: 'Recorded batch weight in kilograms' },
        { name: 'condition', type: 'VARCHAR(50)', desc: 'Clean / Mixed / High Grade / Damaged' },
        { name: 'source_type', type: 'VARCHAR(50)', desc: 'Residential collection / Dismantler / Small shop' },
        { name: 'estimated_value', type: 'DECIMAL(10,2)', desc: 'AI estimated valuation amount in INR' },
        { name: 'timestamp', type: 'TIMESTAMP', desc: 'ISO8601 creation timestamp' },
        { name: 'location', type: 'VARCHAR(100)', desc: 'GPS geolocation tag (e.g., Hadapsar, Pune)' },
      ],
      sampleData: INITIAL_MATERIALS.slice(0, 4),
    },
    {
      id: 'Price',
      title: '2. Price Dataset (price_id PK)',
      description: 'Historical regional prevailing market prices and recycler buying/selling rates.',
      fields: [
        { name: 'price_id', type: 'VARCHAR(50) PK', desc: 'Price snapshot reference ID' },
        { name: 'material_category', type: 'VARCHAR(50) FK', desc: 'Material category mapping' },
        { name: 'subcategory', type: 'VARCHAR(100)', desc: 'Grade variant detail' },
        { name: 'location', type: 'VARCHAR(100)', desc: 'Regional market hub (Pune / Mumbai / Nagpur)' },
        { name: 'date_time', type: 'TIMESTAMP', desc: 'Price index quote timestamp' },
        { name: 'buying_price', type: 'DECIMAL(10,2)', desc: 'Collector procurement rate (₹/kg)' },
        { name: 'selling_price', type: 'DECIMAL(10,2)', desc: 'Authorized recycler purchasing rate (₹/kg)' },
        { name: 'unit', type: 'VARCHAR(20)', desc: '₹/kg or ₹/unit' },
        { name: 'recycler_id', type: 'VARCHAR(50) FK', desc: 'Quoting recycler ID' },
        { name: 'source', type: 'VARCHAR(50)', desc: 'Direct Recycler Feed / CPCB Index / Mandi Benchmark' },
      ],
      sampleData: INITIAL_PRICE_DATASET,
    },
    {
      id: 'Recycler',
      title: '3. Recycler Dataset (recycler_id PK)',
      description: 'State Pollution Control Board (SPCB/CPCB) authorized facility directory.',
      fields: [
        { name: 'recycler_id', type: 'VARCHAR(50) PK', desc: 'Unique facility identifier (e.g., REC-PUNE-01)' },
        { name: 'name', type: 'VARCHAR(255)', desc: 'Registered corporate facility name' },
        { name: 'location', type: 'VARCHAR(255)', desc: 'Industrial zone address & GPS coordinates' },
        { name: 'materials_accepted', type: 'JSONB/ARRAY', desc: 'Array of accepted material categories' },
        { name: 'authorization_details', type: 'VARCHAR(255)', desc: 'MPCB/CPCB License registration number & validity' },
        { name: 'authorization_status', type: 'VARCHAR(50)', desc: 'Authorized / Unverified / Expired' },
        { name: 'contact', type: 'VARCHAR(50)', desc: 'Verified phone & email contact' },
        { name: 'offered_rate', type: 'DECIMAL(5,2)', desc: 'Multiplier relative to prevailing benchmark index' },
        { name: 'pickup_available', type: 'BOOLEAN', desc: 'Whether facility offers logistics pickup service' },
        { name: 'service_area', type: 'VARCHAR(255)', desc: 'Operating radius / district coverage' },
      ],
      sampleData: VERIFIED_RECYCLERS_DATASET,
    },
    {
      id: 'Transaction',
      title: '4. Transaction Dataset (transaction_id PK)',
      description: 'Handover payment logs, financial balances, and payment modes.',
      fields: [
        { name: 'transaction_id', type: 'VARCHAR(50) PK', desc: 'Financial ledger transaction reference' },
        { name: 'lot_id', type: 'VARCHAR(50) FK', desc: 'Associated Lot ID (e.g., LOT-2026-PN-000182)' },
        { name: 'collector_id', type: 'VARCHAR(50) FK', desc: 'Informal collector identifier' },
        { name: 'material', type: 'VARCHAR(50)', desc: 'Material category' },
        { name: 'weight', type: 'DECIMAL(10,2)', desc: 'Verified weight in kg' },
        { name: 'quoted_price', type: 'DECIMAL(10,2)', desc: 'Initial AI & recycler quoted offer in INR' },
        { name: 'final_price', type: 'DECIMAL(10,2)', desc: 'Agreed final realized payment in INR' },
        { name: 'recycler_id', type: 'VARCHAR(50) FK', desc: 'Purchasing authorized recycler ID' },
        { name: 'collection_location', type: 'VARCHAR(255)', desc: 'Pickup point location' },
        { name: 'handover_location', type: 'VARCHAR(255)', desc: 'Facility or drop point address' },
        { name: 'date_time', type: 'TIMESTAMP', desc: 'Transaction execution timestamp' },
        { name: 'payment_status', type: 'VARCHAR(50)', desc: 'PENDING / COMPLETED / REJECTED' },
        { name: 'transaction_status', type: 'VARCHAR(50)', desc: 'CREATED / MATCHED / RECYCLED' },
      ],
      sampleData: INITIAL_DEMO_LOTS,
    },
    {
      id: 'Traceability',
      title: '5. Traceability Dataset (trace_id PK)',
      description: 'Government compliance proof of chain-of-custody from collection to recycling.',
      fields: [
        { name: 'trace_id', type: 'VARCHAR(50) PK', desc: 'Digital audit trail hash ID' },
        { name: 'lot_id', type: 'VARCHAR(50) FK', desc: 'Target Lot ID link' },
        { name: 'photographs', type: 'JSONB', desc: 'Array of timestamped image hashes' },
        { name: 'weight', type: 'DECIMAL(10,2)', desc: 'Weight verification measurement' },
        { name: 'timestamp', type: 'TIMESTAMP', desc: 'Verification lock timestamp' },
        { name: 'gps', type: 'VARCHAR(100)', desc: 'Precision latitude/longitude' },
        { name: 'handover_reference', type: 'VARCHAR(100)', desc: 'Dual-confirmation auth token' },
        { name: 'recycler_confirmation', type: 'BOOLEAN', desc: 'Recycler digital signature verification' },
        { name: 'transaction_status', type: 'VARCHAR(50)', desc: 'Lifecycle stage tracking' },
      ],
      sampleData: INITIAL_DEMO_LOTS.map(l => ({
        trace_id: `TRC-${l.lot_id.replace('LOT-', '')}`,
        lot_id: l.lot_id,
        photographs: [l.photo_url],
        weight: l.weight_kg,
        timestamp: l.collection_timestamp,
        gps: '18.5089° N, 73.9260° E',
        handover_reference: 'CONF-8829-VERIFIED',
        recycler_confirmation: true,
        transaction_status: l.transaction_status,
      })),
    },
    {
      id: 'Collector',
      title: '6. Collector Profile Dataset (collector_id PK)',
      description: 'Minimal collector identity, language preferences, and historical earnings.',
      fields: [
        { name: 'collector_id', type: 'VARCHAR(50) PK', desc: 'Collector ID (e.g., COL-00128)' },
        { name: 'language', type: 'VARCHAR(10)', desc: 'Vernacular choice: mr (Marathi), hi (Hindi), en' },
        { name: 'operating_location', type: 'VARCHAR(100)', desc: 'Hub operating area (e.g., Hadapsar, Pune)' },
        { name: 'transaction_history', type: 'JSONB', desc: 'Historical collection lot references' },
        { name: 'earnings_history', type: 'JSONB', desc: 'Realized & pending financial payouts ledger' },
      ],
      sampleData: [INITIAL_COLLECTOR],
    },
  ];

  // Architecture Nodes information for the interactive diagram
  const nodeDetails = {
    collector: {
      name: '1. Collector Mobile App',
      tag: 'CLIENT LAYER (Android)',
      tech: 'React Native / Web PWA',
      features: [
        'Vernacular (Marathi/Hindi/English) Low-Literacy UI',
        'Voice Text-to-Speech (TTS) Instructions',
        'Camera Photograph Capture & Photo Tensor Upload',
        'Large Touch Target Controls & Minimal Typing',
      ],
      offlineBehavior: 'Stores lot drafts, offline prices, and safety cards inside local SQLite cache.',
    },
    sqlite: {
      name: '2. Local SQLite DB & Sync Queue',
      tag: 'OFFLINE ENGINE',
      tech: 'SQLite3 + FIFO Sync Queue',
      features: [
        'Local Storage of pending lot creations (LOT-2026-PN-XXXXXX)',
        'FIFO Offline Sync Queue with exponential backoff retries',
        'Optimistic UI state updates for immediate user feedback',
        'Network status watcher (ONLINE 🟢 vs OFFLINE 🔴)',
      ],
      offlineBehavior: 'Guarantees zero data loss when mobile network is lost in remote collection areas.',
    },
    network: {
      name: '3. Network API Gateway & Sync Protocol',
      tag: 'TRANSPORT LAYER',
      tech: 'REST / HTTPS / WebSocket Gateway',
      features: [
        'Secure TLS 1.3 encrypted data transmission',
        'Automatic synchronization of pending offline queue items',
        'Payload compression & bandwidth optimization for 2G/3G networks',
        'Bearer Auth & Device Signature Token Validation',
      ],
      offlineBehavior: 'Buffers transactions during network outages and syncs when connection re-establishes.',
    },
    backend: {
      name: '4. Cloud Backend Microservices API',
      tag: 'CORE BACKEND',
      tech: 'Node.js Express / Python FastAPI',
      features: [
        'RESTful API Endpoints for Lot Creation & Recycler Match',
        'Traceability Chain Validator & Ledger Logger',
        'Recycler Authentication & License Authorization Verifier',
        'Digital Receipt PDF & QR Code Generator',
      ],
      offlineBehavior: 'Central hub routing requests to Price Engine, AI Services, and PostgreSQL Datasets.',
    },
    cloud_db: {
      name: '5. Cloud Database (PostgreSQL 16 & S3 Storage)',
      tag: 'PERSISTENCE LAYER',
      tech: 'PostgreSQL 16 + S3 Object Storage',
      features: [
        'Housing for the 6 Core Relational Datasets (Material, Price, Recycler, Transaction, Traceability, Collector)',
        'ACID-compliant transactions for verifiable handovers',
        'AWS S3 Compatible Object Storage for Lot Photograph Hashes',
        'CPCB Audit trail log archiving & compliance reports',
      ],
      offlineBehavior: 'Authoritative database backing digital chain-of-custody lot verification.',
    },
    ai_services: {
      name: '6. AI/ML Services Engine',
      tag: 'INTELLIGENCE LAYER',
      tech: 'Python PyTorch + Scikit-Learn Engine',
      features: [
        '1. Material Vision Classifier (Photo → 87% PCB confidence)',
        '2. Dynamic Price Valuation Engine (Material + Weight + Condition → Fair Range)',
        '3. Recycler Score Matcher (Distance + Price + Pickup + Auth Status)',
        '4. Abnormal Transaction Detector (Flags price suppression >20%)',
      ],
      offlineBehavior: 'Runs statistical rules model on device when offline; executes ML models on cloud when online.',
    },
  };

  const activeDataObj = datasets.find(d => d.id === activeDataset) || datasets[0];
  const activeNodeInfo = nodeDetails[selectedNode] || nodeDetails['collector'];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 pb-20 bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 rounded-3xl space-y-2 shadow-lg border border-teal-800/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400">
              <Server className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">System Architecture & Relational Datasets</h1>
              <p className="text-xs text-teal-200/80 font-medium">
                Offline-First Data Pipeline, AI Microservices & 6 Core PostgreSQL/SQLite Datasets
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>CPCB & DPDP Compliant</span>
          </span>
        </div>
      </div>

      {/* SECTION 1: Enhanced Visual System Architecture Diagram */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden">
        {/* Subtle Background Mesh Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-teal-400" />
              <span>Interactive End-to-End System Architecture Flow</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Click any node in the diagram below to inspect its protocols, offline state behavior, and microservice APIs.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-800/60">
            <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Data Flow Active</span>
          </div>
        </div>

        {/* Multi-Node Animated Pipeline Map */}
        <div className="relative z-10 space-y-6">
          {/* Top Row: Client & Offline Engine */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            {/* NODE 1: Collector Mobile App */}
            <div
              onClick={() => setSelectedNode('collector')}
              className={`md:col-span-4 p-4 rounded-2xl border cursor-pointer transition-all space-y-3 relative ${
                selectedNode === 'collector'
                  ? 'bg-gradient-to-br from-emerald-900/60 to-teal-900/60 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg'
                  : 'bg-slate-800/70 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Smartphone className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">1. Collector Mobile App</h3>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold block">Android / PWA</span>
                  </div>
                </div>
                {selectedNode === 'collector' && <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />}
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/80 text-[10px] space-y-1 font-mono text-slate-300">
                <div className="text-emerald-400 font-bold">📷 Vernacular & Voice UI</div>
                <div>📍 GPS Geotagged Lot Creation</div>
                <div>🖼️ Photo Tensor Input</div>
              </div>
            </div>

            {/* CONNECTING CONNECTOR 1 -> 2 */}
            <div className="md:col-span-1 flex items-center justify-center my-2 md:my-0">
              <div className="flex flex-col items-center space-y-1">
                <span className="text-[9px] font-mono text-emerald-400 font-bold">Local Sync</span>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <ArrowRight className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* NODE 2: Local SQLite DB & Sync Queue */}
            <div
              onClick={() => setSelectedNode('sqlite')}
              className={`md:col-span-7 p-4 rounded-2xl border cursor-pointer transition-all space-y-3 relative ${
                selectedNode === 'sqlite'
                  ? 'bg-gradient-to-br from-amber-950/60 to-slate-900 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                  : 'bg-slate-800/70 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <Database className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">2. Local SQLite DB & Sync Queue</h3>
                    <span className="text-[10px] text-amber-400 font-mono font-bold block">Offline-First Core Engine</span>
                  </div>
                </div>
                {selectedNode === 'sqlite' && <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-700 text-amber-300">
                  <span className="font-bold block text-white">SQLite Cache</span>
                  Lot drafts & cached price index
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-700 text-emerald-400">
                  <span className="font-bold block text-white">Sync Queue</span>
                  FIFO queue retries when online
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE CONNECTOR ROW (Client to Server Internet Bridge) */}
          <div
            onClick={() => setSelectedNode('network')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col md:flex-row items-center justify-between gap-3 text-xs ${
              selectedNode === 'network'
                ? 'bg-emerald-950/70 border-emerald-400 ring-2 ring-emerald-400/30'
                : 'bg-slate-800/50 border-slate-700/70 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center space-x-2 text-emerald-400 font-bold font-mono">
              <Wifi className="w-4 h-4 animate-pulse" />
              <span>3. Network Transport Layer: REST / WebSockets / TLS 1.3 Gateway</span>
            </div>

            <div className="flex items-center space-x-2 font-mono text-[10px] text-slate-300">
              <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-700">ONLINE 🟢</span>
              <span>↔</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-700">OFFLINE 🔴 Queue Retry</span>
            </div>
          </div>

          {/* Bottom Row: Cloud API, Cloud Database & AI Microservices */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            {/* NODE 4: Backend Microservices API */}
            <div
              onClick={() => setSelectedNode('backend')}
              className={`md:col-span-4 p-4 rounded-2xl border cursor-pointer transition-all space-y-3 relative ${
                selectedNode === 'backend'
                  ? 'bg-gradient-to-br from-teal-950/80 to-slate-900 border-teal-400 ring-2 ring-teal-400/40 shadow-lg'
                  : 'bg-slate-800/70 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                    <Server className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">4. Cloud Backend API</h3>
                    <span className="text-[10px] text-teal-400 font-mono font-bold block">Node.js / Express / Python</span>
                  </div>
                </div>
                {selectedNode === 'backend' && <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />}
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700 text-[10px] space-y-1 font-mono text-slate-300">
                <div>⚡ Traceability Ledger Logger</div>
                <div>📜 QR Receipt Generator</div>
                <div>🔒 License Verifier</div>
              </div>
            </div>

            {/* NODE 5: Cloud Database (PostgreSQL & S3 Storage) */}
            <div
              onClick={() => setSelectedNode('cloud_db')}
              className={`md:col-span-4 p-4 rounded-2xl border cursor-pointer transition-all space-y-3 relative ${
                selectedNode === 'cloud_db'
                  ? 'bg-gradient-to-br from-cyan-950/80 to-slate-900 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg'
                  : 'bg-slate-800/70 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                    <Cloud className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">5. Cloud Persistence DB</h3>
                    <span className="text-[10px] text-cyan-400 font-mono font-bold block">PostgreSQL 16 + S3 Storage</span>
                  </div>
                </div>
                {selectedNode === 'cloud_db' && <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />}
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700 text-[10px] space-y-1 font-mono text-cyan-200">
                <div>🗄️ 6 Relational Schema Tables</div>
                <div>🖼️ AWS S3 Photo Hashes</div>
                <div>📜 CPCB Audit Archiving</div>
              </div>
            </div>

            {/* NODE 6: AI/ML Services Engine */}
            <div
              onClick={() => setSelectedNode('ai_services')}
              className={`md:col-span-4 p-4 rounded-2xl border cursor-pointer transition-all space-y-3 relative ${
                selectedNode === 'ai_services'
                  ? 'bg-gradient-to-br from-purple-950/80 to-slate-900 border-purple-400 ring-2 ring-purple-400/40 shadow-lg'
                  : 'bg-slate-800/70 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                    <Cpu className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">6. AI/ML Services</h3>
                    <span className="text-[10px] text-purple-400 font-mono font-bold block">PyTorch / FastAPI</span>
                  </div>
                </div>
                {selectedNode === 'ai_services' && <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />}
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700 text-[10px] space-y-1 font-mono text-purple-200">
                <div>👁️ Vision Classification (87%)</div>
                <div>💵 Dynamic Price Valuation</div>
                <div>⚠️ Anomaly Alert Guard</div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Architecture Layer Detail Panel */}
        <div className="relative z-10 bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                {activeNodeInfo.tag}
              </span>
              <h3 className="font-black text-white text-base">{activeNodeInfo.name}</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Tech Stack: {activeNodeInfo.tech}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block mb-1">Key Responsibilities & Capabilities:</span>
              <ul className="space-y-1 text-slate-300 font-medium">
                {activeNodeInfo.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1 text-[11px]">
              <span className="text-amber-400 font-bold uppercase tracking-wider block">
                Offline Mode & Connectivity Guarantee:
              </span>
              <p className="text-slate-300 leading-relaxed font-medium">
                {activeNodeInfo.offlineBehavior}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: 6 Relational Datasets Architecture Inspector */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-emerald-600" />
              <span>6 Primary Platform Datasets Schema Explorer</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Normalized relational schema designed for PostgreSQL cloud database and SQLite mobile mirror.
            </p>
          </div>

          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200">
            PostgreSQL 16 / SQLite 3
          </span>
        </div>

        {/* Dataset Selector Tabs */}
        <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-none">
          {datasets.map(d => (
            <button
              key={d.id}
              onClick={() => setActiveDataset(d.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all border ${
                activeDataset === d.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {d.title}
            </button>
          ))}
        </div>

        {/* Active Dataset Schema Table */}
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
            <h3 className="font-black text-slate-900 text-base">{activeDataObj.title}</h3>
            <p className="text-xs text-slate-600 font-medium">{activeDataObj.description}</p>
          </div>

          {/* Schema Fields Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden text-xs shadow-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Field Name</th>
                  <th className="p-3">Data Type</th>
                  <th className="p-3">Description & Constraint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
                {activeDataObj.fields.map((f, i) => (
                  <tr key={i} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-emerald-700">{f.name}</td>
                    <td className="p-3 text-slate-500 font-semibold">{f.type}</td>
                    <td className="p-3 font-sans text-slate-600 font-medium">{f.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sample Live Records Preview */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Live Sample Data Preview ({activeDataObj.id} Dataset)</span>
            </h4>

            <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto border border-slate-800 max-h-60 scrollbar-thin">
              {JSON.stringify(activeDataObj.sampleData, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* SECTION 3: Key Architectural Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white border border-slate-200 p-4.5 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Zero Data Loss Offline</span>
          </div>
          <p className="text-slate-600 font-medium">
            Local SQLite database persists every lot creation, photo image, and weight record locally. Automatic sync queue retries when connection re-establishes.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-4.5 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center space-x-2 text-teal-700 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Government Audit Proof</span>
          </div>
          <p className="text-slate-600 font-medium">
            Every lot produces a unique cryptographic Lot ID (`LOT-2026-PN-XXXXXX`) linking collector, material photo, weight, GPS coordinates, and recycler certification.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-4.5 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Anomaly Alert Guard</span>
          </div>
          <p className="text-slate-600 font-medium">
            AI price engine evaluates transactions against prevailing regional market baselines and flags any price suppression &gt;20% for admin review.
          </p>
        </div>
      </div>
    </div>
  );
};
