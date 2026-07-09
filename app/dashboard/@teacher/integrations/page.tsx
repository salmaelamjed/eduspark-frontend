// components/integrations/IntegrationCard.tsx
'use client';

import { useAuth } from "@/context/auth-context";
import { useConnectToStripe } from "@/hooks/integrations/use-integrations";
import { Loader2, Plug, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export default function IntegrationCard() {
  const { 
    handleConnect, 
    isLoading, 
    error, 
    accountStatus,
    isAccountConnected,
    checkAccountStatus,
    isInitializing 
  } = useConnectToStripe();
  const { token } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ✅ Vérifier périodiquement le statut (pour mettre à jour le localStorage)
  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        checkAccountStatus();
      }, 30000); // Toutes les 30 secondes

      return () => clearInterval(interval);
    }
  }, [token, checkAccountStatus]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await checkAccountStatus();
    setIsRefreshing(false);
  };

  const getStatusBadge = () => {
    if (isAccountConnected) {
      return {
        label: "Connecté",
        className: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-3 h-3 mr-1" />
      };
    }
    return {
      label: "Non connecté",
      className: "bg-yellow-100 text-yellow-800",
      icon: null
    };
  };

  const statusBadge = getStatusBadge();

  // ✅ SIMPLIFIÉ : Désactivé si compte existe (peu importe l'onboarding)
  const isButtonDisabled = isLoading || isInitializing || isAccountConnected;

  // ✅ SIMPLIFIÉ : Texte du bouton
  const getButtonText = () => {
    if (isInitializing) return "Vérification...";
    if (isLoading) return "Génération du lien...";
    if (isAccountConnected) return "Compte déjà connecté";
    return "Connecter mon compte";
  };

  // ✅ Si en cours d'initialisation, afficher un skeleton
  if (isInitializing) {
    return (
      <div className="p-6 border rounded-xl max-w-sm bg-white shadow-sm animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-16 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-xl max-w-sm bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Stripe Connect</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center ${statusBadge.className}`}>
          {statusBadge.icon}
          {statusBadge.label}
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="ml-1 hover:opacity-75 transition-opacity"
            title="Rafraîchir le statut"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </span>
      </div>
      
      <p className="text-sm text-gray-500 mb-6">
        {isAccountConnected 
          ? "✅ Votre compte Stripe est configuré et connecté."
          : "Configurez votre compte Stripe pour commencer à percevoir vos revenus de formation de manière sécurisée."}
      </p>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 p-2 rounded mb-4">
          ⚠️ {error}
        </p>
      )}

      <button
        onClick={() => handleConnect(token)}
        disabled={isButtonDisabled}
        className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isAccountConnected
            ? 'bg-green-100 text-green-700 hover:bg-green-200 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        {isLoading || isInitializing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isAccountConnected ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <Plug className="w-4 h-4" />
        )}
        {getButtonText()}
      </button>

      {!isAccountConnected && (
        <p className="text-xs text-gray-400 mt-3 text-center">
          Vous serez redirigé vers Stripe pour finaliser la configuration.
        </p>
      )}
    </div>
  );
}