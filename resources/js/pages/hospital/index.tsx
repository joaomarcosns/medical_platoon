import { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    PlusCircle,
    Pencil,
    Trash2,
    MoreVertical,
    CheckCircle2,
    XCircle,
    MapPin,
    Phone,
    User,
    Shield,
    Search,
    Calendar,
    Clock
} from "lucide-react";

import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";

// Componentes UI
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter
} from "@/components/ui/card";

// Dropdown e Alert Dialog
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Hospital {
    id: number;
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    status: "active" | "pending" | "inactive";
    verified: boolean;
    createdAt: string;
    lastUpdate: string;
    adminName: string;
    plantoesCount: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administração', href: '/admin' },
    { title: 'Hospitais', href: '/admin/hospitals' },
];

const hospitals: Hospital[] = [
    {
        id: 1,
        name: "Hospital São Lucas",
        email: "admin@saolucas.com.br",
        address: "Rua das Flores, 123 - Centro",
        city: "São Paulo",
        state: "SP",
        phone: "(11) 1234-5678",
        status: "active",
        verified: true,
        createdAt: "15/03/2023",
        lastUpdate: "02/05/2024",
        adminName: "Dr. Carlos Silva",
        plantoesCount: 24,
    },
    // ... outros hospitais (mesmo array anterior)
];

export default function HospitalAdmin() {
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

    const filteredHospitals = hospitals.filter(hospital =>
        [hospital.name, hospital.city, hospital.adminName].some(field =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    const handleDeleteClick = (hospital: Hospital) => {
        setSelectedHospital(hospital);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        console.log("Deletando hospital:", selectedHospital);
        setDeleteDialogOpen(false);
    };

    const statusVariants = {
        active: { variant: "default", label: "Ativo" },
        pending: { variant: "secondary", label: "Pendente" },
        inactive: { variant: "outline", label: "Inativo" },
    } as const;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gerenciamento de Hospitais" />

            <div className="flex flex-col space-y-6 p-6 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Hospitais</h1>
                        <p className="text-muted-foreground">
                            Visualize e gerencie todos os hospitais cadastrados no sistema
                        </p>
                    </div>
                    <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Adicionar Hospital
                    </Button>
                </div>

                {/* Filtro e Cards */}
                <div className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Filtrar hospitais..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Shield className="h-4 w-4" />
                            <span>Total: {hospitals.length} hospitais</span>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredHospitals.map((hospital) => (
                            <Card key={hospital.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{hospital.name}</CardTitle>
                                        <Badge
                                            variant={statusVariants[hospital.status].variant}
                                            className={
                                                hospital.status === "active"
                                                    ? "bg-green-100 text-green-700 border-green-200"
                                                    : hospital.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                                    : "bg-gray-100 text-gray-700 border-gray-200"
                                            }
                                        >
                                            {statusVariants[hospital.status].label}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">

                                        <span>{hospital.city}, {hospital.state}</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-3">

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            {hospital.verified ? (
                                                <>
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    <span className="text-green-600">Verificado</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                    <span className="text-red-600">Não verificado</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span>{hospital.adminName}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="line-clamp-1">{hospital.address}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{hospital.phone}</span>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                Criado em <span className="font-medium text-foreground">{hospital.createdAt}</span>
                                                {" • "}
                                                Atualizado em <span className="font-medium text-foreground">{hospital.lastUpdate}</span>
                                            </span>
                                        </div>
                                        <Badge
                                            variant={hospital.plantoesCount > 0 ? "default" : "outline"}
                                            className="flex items-center gap-1 px-2 py-1 text-xs"
                                        >
                                            <Clock className="h-3 w-3" />
                                            <span>{hospital.plantoesCount} plantão{hospital.plantoesCount !== 1 && "s"} ativo{hospital.plantoesCount !== 1 && "s"}</span>
                                        </Badge>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" size="sm">
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => handleDeleteClick(hospital)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Remover
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover o hospital {selectedHospital?.name}?
                            Esta ação não pode ser desfeita e afetará todos os plantões associados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={confirmDelete}
                        >
                            Confirmar Exclusão
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    )
}
