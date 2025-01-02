import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Save } from 'lucide-react';
import { search } from '@/types/datatypes';

interface UserData {
  id: number;
  google_id: string;
  email: string;
  name: string;
  image: string;
  created_at: string;
  updated_at: string;
  search_history?: search[];
}

const Settings = ({ userdata }: { userdata: UserData }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <Card className="w-full bg-gray-900 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex justify-between items-center">
          Settings
          {/* <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
          </Button> */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={userdata.image} alt={userdata.name} />
              <AvatarFallback>{userdata.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={userdata.name}
              disabled
              className="bg-gray-800 text-white border-gray-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={userdata.email}
              disabled
              className="bg-gray-800 text-white border-gray-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="search-history">Search History</Label>
            <div className="bg-gray-800 text-white border-gray-700 p-3 space-y-2">
              {userdata.search_history?.map((search, index) => (
                <div key={index} className="p-2 bg-gray-700 rounded">
                  {search.playlistname}
                </div>
              )) || <p>No search history available.</p>}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default Settings;
